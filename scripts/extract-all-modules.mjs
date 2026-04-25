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
  /^Communication$/i
];

function isHeading(line) {
  if (!line || line.length > 80 || line.length < 3) return false;
  return HEADING_PATTERNS.some((re) => re.test(line));
}

async function main() {
  const data = new Uint8Array(await fs.readFile(pdfPath));
  const pdf = await pdfjsLib.getDocument({ data, disableFontFace: true }).promise;

  const result = {};

  for (const [moduleId, range] of Object.entries(ranges)) {
    const allLines = [];

    for (let pageNum = range.start; pageNum <= Math.min(range.end, pdf.numPages); pageNum += 1) {
      const page = await pdf.getPage(pageNum);
      const content = await page.getTextContent();

      // Collapse text items into lines based on Y position
      const items = content.items
        .filter((i) => i && typeof i.str === "string")
        .sort((a, b) => {
          if (!a.transform || !b.transform) return 0;
          const ay = a.transform[5];
          const by = b.transform[5];
          if (Math.abs(ay - by) > 4) return by - ay; // top-to-bottom
          return a.transform[4] - b.transform[4]; // left-to-right
        });

      let buffer = [];
      let lastY = null;
      const pageLines = [];
      for (const item of items) {
        const y = item.transform ? item.transform[5] : 0;
        const txt = item.str;
        if (lastY !== null && Math.abs(y - lastY) > 4) {
          if (buffer.length > 0) pageLines.push(buffer.join("").trim());
          buffer = [];
        }
        buffer.push(txt);
        lastY = y;
      }
      if (buffer.length > 0) pageLines.push(buffer.join("").trim());

      for (const line of pageLines) {
        if (line) allLines.push(line);
      }
    }

    // Clean each line
    const cleaned = allLines
      .map((line) => line.replace(/\s+/g, " ").trim())
      .filter((line) => {
        if (!line) return false;
        if (/Alberta Solicitor General/i.test(line)) return false;
        if (/Ministry of Public Security/i.test(line)) return false;
        if (/Alberta Basic Security Training/i.test(line)) return false;
        if (/Module (One|Two|Three|Four|Five|Six|Seven|Eight),?\s*Page\s*\d+/i.test(line)) return false;
        if (/^Page \d+/i.test(line)) return false;
        if (/^Jan-?14$/i.test(line)) return false;
        if (/^© \d{4}/i.test(line)) return false;
        if (/^Used under license/i.test(line)) return false;
        if (/^iStock #/i.test(line)) return false;
        if (/^Photo by/i.test(line)) return false;
        if (line.length === 1) return false;
        // Drop heavily-fragmented lines (lots of single letters separated by spaces)
        const tokens = line.split(/\s+/);
        const single = tokens.filter((t) => t.length === 1).length;
        if (single > tokens.length * 0.45 && tokens.length > 4) return false;
        return true;
      });

    // Detect headings + join paragraphs
    const sections = [];
    let current = { heading: "Overview", body: [], list: null };
    let buffer = "";

    function flushBuffer() {
      const text = buffer.replace(/\s+/g, " ").trim();
      if (text.length > 30) current.body.push(text);
      buffer = "";
    }
    function flushSection() {
      if (current.list) {
        current.body.push(current.list);
        current.list = null;
      }
      flushBuffer();
      if (current.body.length > 0) sections.push(current);
    }

    for (const line of cleaned) {
      if (isHeading(line)) {
        flushSection();
        current = { heading: line.replace(/:$/, ""), body: [], list: null };
        continue;
      }
      // Bullet
      if (/^[\u2022•\-]\s+/.test(line) || /^\d+\.\s+/.test(line)) {
        flushBuffer();
        if (!current.list) current.list = { kind: "list", items: [] };
        current.list.items.push(line.replace(/^[\u2022•\-]\s*/, "").replace(/^\d+\.\s*/, "").trim());
        continue;
      }
      // Otherwise treat as paragraph continuation
      if (current.list) {
        current.body.push(current.list);
        current.list = null;
      }
      if (buffer && !buffer.match(/[.!?:]\s*$/)) {
        buffer += " " + line;
      } else {
        flushBuffer();
        buffer = line;
      }
    }
    flushSection();

    // Final dedupe across sections
    const seen = new Set();
    const finalSections = [];
    for (const sec of sections) {
      const body = [];
      for (const block of sec.body) {
        if (typeof block === "string") {
          const key = block.toLowerCase().slice(0, 80);
          if (seen.has(key)) continue;
          seen.add(key);
          body.push({ kind: "paragraph", text: block });
        } else if (block && block.kind === "list") {
          const items = [];
          for (const i of block.items) {
            const key = "li:" + i.toLowerCase().slice(0, 80);
            if (seen.has(key)) continue;
            seen.add(key);
            items.push(i);
          }
          if (items.length > 0) body.push({ kind: "list", items });
        }
      }
      if (body.length > 0) finalSections.push({ heading: sec.heading, body });
    }

    result[moduleId] = {
      title: range.title,
      start: range.start,
      end: range.end,
      sections: finalSections.slice(0, 14)
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
    console.log(`${k}: ${v.sections.length} sections (pages ${v.start}-${v.end})`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
