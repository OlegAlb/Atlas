import fs from "node:fs/promises";

import { IngestionEvalCase, IngestionEvalResult } from "./ingestion.models";
import { DocumentLoader } from "../../src/infrastructure/loaders/document-loader";
import { DocumentParser } from "../../src/infrastructure/parsers/document-parser";
import { Chunker } from "../../src/chunking";

export class IngestionEvaluator {
  constructor(
    private readonly loader: DocumentLoader,
    private readonly parser: DocumentParser,
    private readonly chunker: Chunker,
  ) {}

  async evaluate(
    testCase: IngestionEvalCase,
    fixturePath: string,
  ): Promise<IngestionEvalResult> {
    const data = await fs.readFile(fixturePath, "utf8");

    const source = await this.loader.load({
      title: testCase.input.title,
      text: data,
    });

    const document = await this.parser.parse(source);

    const chunks = this.chunker.chunk(document);

    const chunkedText = chunks.map((chunk) => chunk.text).join("\n");

    const checks = [
      {
        name: "mime type preserved",

        passed: document.metadata.mimeType === testCase.expected.mimeType,
      },

      {
        name: "document has pieces",

        passed: document.pieces.length > 0,
      },

      {
        name: "content preserved",

        passed:
          !testCase.expected.contains ||
          testCase.expected.contains.every((value) =>
            document.pieces.some((piece) => piece.text.includes(value)),
          ),
      },

      {
        name: "chunks count",

        passed:
          !testCase.expected.chunks ||
          (chunks.length >= testCase.expected.chunks.min &&
            (!testCase.expected.chunks.max ||
              chunks.length <= testCase.expected.chunks.max)),
      },

      {
        name: "chunks preserve content",

        passed:
          !testCase.expected.contains ||
          testCase.expected.contains.every((value) =>
            chunkedText.includes(value),
          ),
      },
    ];

    return {
      id: testCase.id,

      name: testCase.name,

      passed: checks.every((check) => check.passed),

      checks,
    };
  }
}
