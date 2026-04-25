import { promises as fs } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, "..");
const pdfPath = join(repoRoot, "public", "manual", "abst-manual.pdf");
const outFile = join(repoRoot, "lib", "data", "moduleSnippets.ts");

const ranges = {
  "module-one": { title: "Module One: Introduction to the Security Industry", start: 9, end: 25 },
  "module-two": { title: "Module Two: The Canadian Legal System", start: 26, end: 50 },
  "module-three": { title: "Module Three: Basic Security Procedures", start: 51, end: 87 },
  "module-four": { title: "Module Four: Communication for Security Professionals", start: 88, end: 106 },
  "module-five": { title: "Module Five: Documentation and Evidence", start: 107, end: 129 },
  "module-six": { title: "Module Six: Emergency Response Procedures", start: 130, end: 147 },
  "module-seven": { title: "Module Seven: Health and Safety", start: 148, end: 180 },
  "module-eight": { title: "Module Eight: Final Review", start: 181, end: 200 }
};

// Common section headings that appear in the manual; used to split content.
const HEADING_PATTERNS = [
  /^Introduction$/i,
  /^Conclusion$/i,
  /^Learning Outcomes$/i,
  /^Topics$/i,
  /^Activity\s+\d+/i,
  /^Practice #?\d+/i,
  /^Notebooks?$/i,
  /^Reports?$/i,
  /^Statements?$/i,
  /^Evidence$/i,
  /^Witness Statements?$/i,
  /^Photographs?$/i,
  /^The Phonetic Alphabet$/i,
  /^Use of Force Reports?$/i,
  /^The 24-?Hour Clock/i,
  /^Types of Evidence$/i,
  /^Court(s)?$/i,
  /^Sample Notebook|^Sample Report/i,
  /^Test your knowledge/i,
  /^Check your progress/i,
  /^Patrol(s)?$/i,
  /^Access Control$/i,
  /^Emergency Response$/i,
  /^Communication$/i,
  /^Verbal/i,
  /^Non-?verbal/i,
  /^Phonetic Alphabet/i,
  /^Listening/i,
  /^Body Language/i,
  /^Hazards?$/i,
  /^Personal Safety/i,
  /^Workplace Safety/i,
  /^Fire(s)?$/i,
  /^Medical (Emergencies?|Response)/i,
  /^Bomb Threats?/i,
  /^Active (Threats?|Shooter)/i,
  /^De-?Escalation/i,
  /^The Industry$/i,
  /^Roles? and Responsibilities/i,
  /^Ethics$/i,
  /^Licens(ing|e)/i,
  /^Criminal Law/i,
  /^Civil Law/i,
  /^Authority/i,
  /^Arrests?$/i,
  /^Use of Force/i
];

function isHeading(line) {
  if (!line || line.length > 90 || line.length < 3) return false;
  if (HEADING_PATTERNS.some((re) => re.test(line))) return true;
  // Also treat short lines that are all-title-case + end with no period as a heading.
  const words = line.split(/\s+/).filter(Boolean);
  if (words.length >= 1 && words.length <= 7 && /^[A-Z]/.test(line) && !/[.!?]$/.test(line)) {
    const titleCase = words.every((w) => /^[A-Z]/.test(w) || /^(of|and|or|the|to|in|for|on|by|a|an|with)$/i.test(w));
    if (titleCase && line.length <= 60) return true;
  }
  return false;
}

function isHeaderFooter(line) {
  if (!line) return true;
  if (/Alberta Solicitor General/i.test(line)) return true;
  if (/Ministry of Public Security/i.test(line)) return true;
  if (/Alberta Basic Security Training/i.test(line)) return true;
  if (/Module (One|Two|Three|Four|Five|Six|Seven|Eight),?\s*Page\s*\d+/i.test(line)) return true;
  if (/^Page \d+/i.test(line)) return true;
  if (/^Jan-?14$/i.test(line)) return true;
  if (/^© \d{4}/i.test(line)) return true;
  if (/^Used under license/i.test(line)) return true;
  if (/^iStock #/i.test(line)) return true;
  if (/^Photo by/i.test(line)) return true;
  if (line.length === 1) return true;
  return false;
}

function looksFragmented(line) {
  // Reject lines that are mostly single-letter tokens (typical PDF text artifacts)
  const tokens = line.split(/\s+/).filter(Boolean);
  if (tokens.length < 3) return false;
  const single = tokens.filter((t) => t.length === 1).length;
  return single / tokens.length > 0.45;
}

async function extractPageLines(page) {
  const content = await page.getTextContent();
  const items = content.items
    .filter((i) => i && typeof i.str === "string")
    .map((i) => ({
      str: i.str,
      x: i.transform ? i.transform[4] : 0,
      y: i.transform ? i.transform[5] : 0,
      hasEOL: Boolean(i.hasEOL)
    }));

  // Group items into rows by Y position.
  const rows = new Map();
  for (const item of items) {
    const key = Math.round(item.y);
    if (!rows.has(key)) rows.set(key, []);
    rows.get(key).push(item);
  }

  const lines = [];
  // Iterate top to bottom (PDF Y is bottom-up so larger Y first).
  const ys = [...rows.keys()].sort((a, b) => b - a);
  for (const y of ys) {
    const row = rows.get(y).sort((a, b) => a.x - b.x);
    const text = row.map((r) => r.str).join("").replace(/\s+/g, " ").trim();
    if (text) lines.push(text);
  }
  return lines;
}

async function main() {
  const data = new Uint8Array(await fs.readFile(pdfPath));
  const pdf = await pdfjsLib.getDocument({ data, disableFontFace: true }).promise;

  const result = {};

  for (const [moduleId, range] of Object.entries(ranges)) {
    const allLines = [];
    for (let pageNum = range.start; pageNum <= Math.min(range.end, pdf.numPages); pageNum += 1) {
      const page = await pdf.getPage(pageNum);
      const lines = await extractPageLines(page);
      for (const line of lines) allLines.push(line);
    }

    const cleaned = allLines.filter((line) => !isHeaderFooter(line) && !looksFragmented(line));

    const sections = [];
    let current = { heading: "Overview", body: [] };
    let buffer = "";
    let listBuffer = null;

    function flushParagraph() {
      const text = buffer.replace(/\s+/g, " ").trim();
      if (text.length > 25) current.body.push({ kind: "paragraph", text });
      buffer = "";
    }
    function flushList() {
      if (listBuffer && listBuffer.items.length > 0) {
        current.body.push(listBuffer);
      }
      listBuffer = null;
    }
    function flushSection() {
      flushParagraph();
      flushList();
      if (current.body.length > 0) sections.push(current);
    }

    for (const rawLine of cleaned) {
      const line = rawLine.replace(/\s+/g, " ").trim();
      if (!line) continue;

      if (isHeading(line)) {
        flushSection();
        current = { heading: line.replace(/:$/, ""), body: [] };
        continue;
      }

      // Bullet / numbered list
      const isBullet = /^[\u2022•\-]\s+/.test(line) || /^[Oo]\s+/.test(line);
      const isNumbered = /^\d+\.\s+/.test(line);
      if (isBullet || isNumbered) {
        flushParagraph();
        if (!listBuffer) listBuffer = { kind: "list", items: [] };
        listBuffer.items.push(line.replace(/^[\u2022•\-Oo]\s*/, "").replace(/^\d+\.\s*/, "").trim());
        continue;
      }

      // Otherwise treat as paragraph continuation
      flushList();
      if (buffer && !buffer.match(/[.!?:]\s*$/)) {
        buffer += " " + line;
      } else {
        flushParagraph();
        buffer = line;
      }
    }
    flushSection();

    // Dedupe across the whole module
    const seen = new Set();
    const finalSections = [];
    for (const sec of sections) {
      const body = [];
      for (const block of sec.body) {
        if (block.kind === "paragraph") {
          const key = block.text.toLowerCase().slice(0, 96);
          if (seen.has(key)) continue;
          seen.add(key);
          body.push(block);
        } else if (block.kind === "list") {
          const items = [];
          for (const item of block.items) {
            const key = "li:" + item.toLowerCase().slice(0, 96);
            if (seen.has(key)) continue;
            seen.add(key);
            items.push(item);
          }
          if (items.length > 0) body.push({ kind: "list", items });
        }
      }
      if (body.length > 0) finalSections.push({ heading: sec.heading, body });
    }

    // Merge any sections shorter than 1 paragraph into the previous one.
    const merged = [];
    for (const sec of finalSections) {
      const last = merged[merged.length - 1];
      if (last && sec.body.length === 1 && sec.body[0].kind === "paragraph") {
        last.body.push(sec.body[0]);
      } else {
        merged.push(sec);
      }
    }

    result[moduleId] = {
      title: range.title,
      start: range.start,
      end: range.end,
      sections: merged
    };
  }

  const tsContent =
    "// Auto-generated by scripts/extract-all-modules.mjs.\n" +
    "// Run `node scripts/extract-all-modules.mjs` to refresh.\n\n" +
    "export type ModuleSnippetBlock =\n" +
    "  | { kind: \"paragraph\"; text: string }\n" +
    "  | { kind: \"list\"; items: string[] };\n\n" +
    "export type ModuleSnippetSection = {\n" +
    "  heading: string;\n" +
    "  body: ModuleSnippetBlock[];\n" +
    "};\n\n" +
    "export type ModuleSnippet = {\n" +
    "  title: string;\n" +
    "  start: number;\n" +
    "  end: number;\n" +
    "  sections: ModuleSnippetSection[];\n" +
    "};\n\n" +
    `export const moduleSnippets: Record<string, ModuleSnippet> = ${JSON.stringify(
      result,
      null,
      2
    )};\n`;
  await fs.writeFile(outFile, tsContent, "utf8");
  console.log(`Wrote ${outFile}`);
  for (const [k, v] of Object.entries(result)) {
    const paragraphs = v.sections.reduce(
      (n, s) => n + s.body.filter((b) => b.kind === "paragraph").length,
      0
    );
    const lists = v.sections.reduce((n, s) => n + s.body.filter((b) => b.kind === "list").length, 0);
    console.log(
      `${k}: ${v.sections.length} sections · ${paragraphs} paragraphs · ${lists} lists (pages ${v.start}-${v.end})`
    );
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
