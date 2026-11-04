import { readFileSync } from "node:fs";
import { join } from "node:path";

import regressionCorpus from "../retrieval/normal/corpus.json";
import type { RetrievalCorpusDocument } from "../../seed/seed-retrieval-dataset";

const HARD_CORPUS_PATH = join(
  __dirname,
  "..",
  "retrieval",
  "hard",
  "corpus.json",
);

export function getRetrievalCorpus(name: string): RetrievalCorpusDocument[] {
  switch (name) {
    case "regression":
      return regressionCorpus;

    case "hard":
      return loadHardCorpus();

    default:
      throw new Error(`Unknown dataset: ${name}`);
  }
}

function loadHardCorpus(): RetrievalCorpusDocument[] {
  let raw: string;

  try {
    raw = readFileSync(HARD_CORPUS_PATH, "utf8");
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      throw new Error(
        [
          "NFCorpus data is not present.",
          `Expected file: ${HARD_CORPUS_PATH}`,
          'Run "npm run fetch:data" to download it (about 6 MB).',
        ].join("\n"),
      );
    }

    throw error;
  }

  return JSON.parse(raw) as RetrievalCorpusDocument[];
}
