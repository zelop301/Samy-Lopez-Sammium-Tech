import { cp, mkdir, rm } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const destination = resolve(root, "apps/portfolio/public/projects");
const projects = [
  ["quantumverse", "apps/quantumverse/dist"],
  ["research-lab", "apps/research-lab/dist"],
  ["agrimind-ai", "apps/agrimind-ai/dist"],
  ["cosmos-os", "apps/cosmos-os/dist"]
];
await rm(destination, { recursive: true, force: true });
await mkdir(destination, { recursive: true });

for (const [slug, source] of projects) {
  const sourcePath = resolve(root, source);
  const targetPath = resolve(destination, slug);
  await cp(sourcePath, targetPath, { recursive: true });
  console.log(`Embedded ${slug} -> ${targetPath}`);
}
