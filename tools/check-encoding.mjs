import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const WATCH_LIST = [
  "app/components/DemoChat.tsx",
  "app/api/chat/route.ts",
];

// Common mojibake signatures for UTF-8/CP1251 mismatch.
const BAD_PATTERNS = [
  /\uFFFD/u,
  /пїЅ/u,
  /����/u,
  /вЂ/u,
];

const files = WATCH_LIST.map((rel) => path.join(ROOT, rel)).filter((p) =>
  fs.existsSync(p)
);

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
