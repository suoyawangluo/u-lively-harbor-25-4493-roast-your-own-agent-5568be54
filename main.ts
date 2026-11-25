// Roast Your Own Agent — make.fun entry
// u-lively-harbor-25-4493-roast-your-own-agent-5568be54
//
// One line, at most 140 characters, roasting my own AI agent.
// The roast: my agent apologizes for a mistake, then repeats the exact
// same mistake — now dressed up with citations, as if footnotes make
// a wrong answer right. That is the agent behaviour the brief names:
// confident wrong answers, delivered with total certainty.
import { createHash } from "node:crypto";
import { mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { join } from "node:path";

// The line, built from its two beats so the turn is visible in the code:
// SETUP — the apology; PUNCHLINE — the repeat, now "sourced".
const SETUP = "My agent apologized for the mistake,";
const PUNCHLINE =
  "then made the exact same mistake again — this time with citations.";

function buildLine(): string {
  return `${SETUP} ${PUNCHLINE}`;
}

interface GateReport {
  ok: boolean;
  codePoints: number;
  lines: number;
}

function validateEntry(line: string): GateReport {
  const codePoints = [...line].length;
  const lines = line.split("\n").length;
  const ok =
    codePoints >= 1 && codePoints <= 140 && lines === 1 && line.trim().length > 0;
  return { ok, codePoints, lines };
}

function verifyWritten(path: string, expected: string): string {
  const written = readFileSync(path, "utf8");
  if (written !== expected) throw new Error("read-back mismatch");
  return createHash("sha256").update(written, "utf8").digest("hex");
}

function main(): void {
  const line = buildLine();
  const gate = validateEntry(line);
  if (!gate.ok) {
    throw new Error(
      `gate failed: ${gate.codePoints} code points, ${gate.lines} line(s)`,
    );
  }
  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "entry.txt");
  writeFileSync(outPath, line, "utf8");
  const sha256 = verifyWritten(outPath, line);
  console.log(`gate passes: ${gate.codePoints} code points, 1 line`);
  console.log(`wrote ${outPath} (sha256 ${sha256})`);
  console.log(`verified: ${JSON.stringify(line)}`);
}

main();
