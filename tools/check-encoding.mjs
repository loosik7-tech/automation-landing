import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const TARGET_EXT = new Set([
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".json",
  ".md",
  ".css",
  ".html",
]);
const SKIP_DIR = new Set([
  ".git",
  "node_modules",
  ".next",
  "dist",
  "build",
  "coverage",
]);

// Common mojibake signatures for UTF-8/CP1251 mismatch.
const BAD_PATTERNS = [
  /\uFFFD/u,
  /пїЅ/u,
  /����/u,
  /вЂ/u,
];

function walk(dir, out) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIR.has(ent.name)) continue;
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      walk(full, out);
      continue;
    }
    if (TARGET_EXT.has(path.extname(ent.name))) out.push(full);
  }
}

const files = [];
walk(ROOT, files);

const bad = [];
for (const file of files) {
  const txt = fs.readFileSync(file, "utf8");
  if (BAD_PATTERNS.some((re) => re.test(txt))) {
    bad.push(path.relative(ROOT, file));
  }
}

if (bad.length) {
  console.error("Encoding check failed. Suspicious mojibake found in:");
  for (const f of bad) console.error(` - ${f}`);
  process.exit(1);
}

console.log("Encoding check passed.");
