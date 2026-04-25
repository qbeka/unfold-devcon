import { promises as fs } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { NodeIO } from "@gltf-transform/core";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, "..");
const files = ["officer.glb", "citizen.glb"];

const io = new NodeIO();
for (const f of files) {
  const path = join(repoRoot, "public", "models", f);
  const doc = await io.read(path);
  const root = doc.getRoot();
  console.log(`\n===== ${f} =====`);
  const nodes = root.listNodes();
  console.log(`Total nodes: ${nodes.length}`);
  const skinned = nodes.filter((n) => n.getSkin());
  console.log(`Nodes with skins: ${skinned.length}`);
  const bones = nodes
    .map((n) => n.getName())
    .filter((name) => /arm|shoulder|hand|wrist|leg|hip|spine|neck|head|root|bone|mixamorig|j_bip|^l_|^r_/i.test(name));
  console.log("Bone-like names:", bones.slice(0, 30));
  const animations = root.listAnimations();
  console.log(`Animations: ${animations.length}`, animations.map((a) => a.getName()));
}
