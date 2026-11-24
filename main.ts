// Funniest Autocorrect Fail — make.fun entry.
//
// Writes a single-line autocorrect fail to /output/entry.txt
// (or $OUTPUT_PATH). Deterministic, stdlib only, no network.
//
// The line: a text to the boss where autocorrect swaps "meeting"
// for "mating" — one wrong word, catastrophically wrong meaning,
// and the sender carries on earnestly as if nothing happened.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

const ENTRY =
  "Mr. Thompson, really looking forward to our mating at 3pm — I've got the slides ready and I'm bringing donuts.";

const MAX_CHARS = 199;

function main(): void {
  // The gate counts characters: measure in Unicode code points so a
  // multi-byte character can never slip past the 1-199 limit.
  const charCount = [...ENTRY].length;
  if (charCount < 1 || charCount > MAX_CHARS) {
    throw new Error(`entry is ${charCount} characters, must be 1-${MAX_CHARS}`);
  }
  if (ENTRY.trim().length === 0) {
    throw new Error("entry must not be only whitespace");
  }
  if (/[\r\n]/.test(ENTRY)) {
    throw new Error("entry must be exactly one line");
  }

  const outPath = process.env.OUTPUT_PATH ?? "/output/entry.txt";
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, ENTRY, "utf8");

  // Verify the file round-trips byte-exactly as the single line.
  const written = readFileSync(outPath, "utf8");
  if (written !== ENTRY) {
    throw new Error("written entry does not match the expected line");
  }
}

main();
