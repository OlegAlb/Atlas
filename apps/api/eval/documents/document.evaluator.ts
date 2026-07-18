import fs from "node:fs/promises";

import { Chunker } from "../../src/modules/chunking";
import { DocumentLoader } from "../../src/modules/document/loaders/document-loader";
import { DocumentParser } from "../../src/modules/document/parsers/document-parser";
import { DocumentEvalCase } from "./document.cases";

export interface DocumentEvalResult {
  name: string;

  passed: boolean;

  checks: {
    name: string;
    passed: boolean;
  }[];
}

export class DocumentEvaluator {
  constructor(
    private readonly loader: DocumentLoader,
    private readonly parser: DocumentParser,
    private readonly chunker: Chunker,
  ) {}

  async evaluate(testCase: DocumentEvalCase): Promise<DocumentEvalResult> {
    const data = await fs.readFile(testCase.fixture, "utf8");

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
        name: "content preserved",

        passed: !!testCase.expected.contains?.every((value) =>
          document.pieces.some((piece) => piece.text.includes(value)),
        ),
      },

      {
        name: "document has pieces",

        passed: document.pieces.length > 0,
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
        name: "chunks preserve source",

        passed: !!testCase.expected.contains?.every((value) =>
          chunkedText.includes(value),
        ),
      },
    ];

    return {
      name: testCase.name,

      passed: checks.every((check) => check.passed),

      checks,
    };
  }
}
