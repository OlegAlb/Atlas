import { IngestionEvaluator } from "../ingestion/ingestion.evaluator";

import cases from "../datasets/ingestion/cases.json";
import path from "node:path";
import { PlainTextLoader } from "../../src/infrastructure/loaders/plain-text.loader";
import { PlainTextParser } from "../../src/infrastructure/parsers/plain-text.parser";
import {
  CharacterTokenizer,
  MetadataMerger,
  RecursiveChunker,
} from "../../src/chunking";
import { TokenChunkSizer } from "../../src/chunking/sizer/token.chunk-sizer";

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
