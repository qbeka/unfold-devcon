import { promises as fs } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const pdfPath = join(__dirname, "..", "public", "manual", "abst-manual.pdf");

async function main() {
  const data = new Uint8Array(await fs.readFile(pdfPath));
  const pdf = await pdfjsLib.getDocument({ data, disableFontFace: true }).promise;
  console.log("Total pages:", pdf.numPages);

  for (let pageNum = 1; pageNum <= Math.min(pdf.numPages, 200); pageNum += 1) {
    const page = await pdf.getPage(pageNum);
    const content = await page.getTextContent();
    const text = content.items.map((item) => item.str).join(" ").replace(/\s+/g, " ").trim();
    const upper = text.toUpperCase();
    if (
      upper.includes("MODULE FIVE") ||
      upper.includes("MODULE 5") ||
      upper.includes("MODULE SIX") ||
      upper.includes("MODULE 6") ||
      upper.includes("MODULE FOUR") ||
      upper.includes("MODULE 4")
    ) {
      console.log(`Page ${pageNum}: ${text.slice(0, 180)}`);
    }
  }
}

main();
