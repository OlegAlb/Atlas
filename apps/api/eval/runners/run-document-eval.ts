import {
  CharacterTokenizer,
  MetadataMerger,
  RecursiveChunker,
} from "../../src/modules/chunking";
import { TokenChunkSizer } from "../../src/modules/chunking/sizer/token.chunk-sizer";
import { PlainTextLoader } from "../../src/modules/document/loaders/plain-text.loader";
import { PlainTextParser } from "../../src/modules/document/parsers/plain-text.parser";
import { IngestionEvaluator } from "../ingestion/ingestion.evaluator";

import cases from "../datasets/ingestion/cases.json";
import path from "node:path";

export async function runIngestionEvaluation() {
  const evaluator = new IngestionEvaluator(
    new PlainTextLoader(),
    new PlainTextParser(),
    new RecursiveChunker(
      new TokenChunkSizer(new CharacterTokenizer()),
      new MetadataMerger(),
    ),
  );

  const results = [];

  for (const testCase of cases) {
    const result = await evaluator.evaluate(
      testCase,
      path.join(__dirname, "../datasets/ingestion/fixtures", testCase.fixture),
    );

    results.push(result);
  }

  for (const result of results) {
    console.log(`\n${result.passed ? "✓" : "✗"} ${result.name}`);

    for (const check of result.checks) {
      console.log(`  ${check.passed ? "✓" : "✗"} ${check.name}`);
    }
  }

  console.log(
    `\nScore: ${
      (results.filter((x) => x.passed).length / results.length) * 100
    }%`,
  );
}
