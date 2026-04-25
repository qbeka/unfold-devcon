import { promises as fs } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const pdfPath = join(__dirname, "..", "public", "manual", "abst-manual.pdf");

async function main() {
  const data = new Uint8Array(await fs.readFile(pdfPath));
  const pdf = await pdfjsLib.getDocument({ data, disableFontFace: true }).promise;

  const moduleStarts = {};
  const moduleNames = [
    "MODULE ONE",
    "MODULE TWO",
    "MODULE THREE",
    "MODULE FOUR",
    "MODULE FIVE",
    "MODULE SIX",
    "MODULE SEVEN",
    "MODULE EIGHT"
  ];

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum += 1) {
    const page = await pdf.getPage(pageNum);
    const content = await page.getTextContent();
    const text = content.items.map((i) => i.str).join(" ").replace(/\s+/g, " ");
    const upper = text.toUpperCase();

    for (const name of moduleNames) {
      if (!moduleStarts[name] && upper.includes(`${name}:`)) {
        // Confirm it's not the TOC reference - check Page 1 marker
        if (upper.includes(`${name}:`) && /PAGE 1\b/.test(upper)) {
          moduleStarts[name] = pageNum;
        }
      }
    }
  }

  console.log("Detected module starts:");
  console.log(JSON.stringify(moduleStarts, null, 2));
  console.log("Total PDF pages:", pdf.numPages);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
