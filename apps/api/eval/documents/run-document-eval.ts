import { documentCases } from "./document.cases";
import { DocumentEvaluator } from "./document.evaluator";
import { PlainTextLoader } from "../../src/modules/document/loaders/plain-text.loader";
import { PlainTextParser } from "../../src/modules/document/parsers/plain-text.parser";
import {
  CharacterTokenizer,
  MetadataMerger,
  RecursiveChunker,
} from "../../src/modules/chunking";
import { TokenChunkSizer } from "../../src/modules/chunking/sizer/token.chunk-sizer";

async function main() {
  const evaluator = new DocumentEvaluator(
    new PlainTextLoader(),

    new PlainTextParser(),

    new RecursiveChunker(
      new TokenChunkSizer(new CharacterTokenizer()),
      new MetadataMerger(),
    ),
  );

  const results = [];

  for (const testCase of documentCases) {
    results.push(await evaluator.evaluate(testCase));
  }

  for (const result of results) {
    console.log(`\n${result.passed ? "✓" : "✗"} ${result.name}`);

    for (const check of result.checks) {
      console.log(`  ${check.passed ? "✓" : "✗"} ${check.name}`);
    }
  }

  const score = (results.filter((r) => r.passed).length / results.length) * 100;

  console.log(`\nScore: ${score}%`);
}

main();
