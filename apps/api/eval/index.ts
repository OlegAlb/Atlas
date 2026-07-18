import { parseArgs } from "node:util";

import { runRetrievalEvaluation } from "./runners/run-retrieval-eval";
import { RetrievalType } from "./retrieval/create-evaluation-engine";
import { runIngestionEvaluation } from "./runners/run-document-eval";

async function main() {
  const { values } = parseArgs({
    options: {
      ingestion: {
        type: "boolean",
      },

      retrieval: {
        type: "boolean",
      },

      hybrid: {
        type: "boolean",
      },

      dense: {
        type: "boolean",
      },

      bm25: {
        type: "boolean",
      },
    },
  });

  const runAll =
    !values.ingestion &&
    !values.retrieval &&
    !values.hybrid &&
    !values.dense &&
    !values.bm25;

  const engines: RetrievalType[] = [];

  if (values.hybrid) {
    engines.push("hybrid");
  }

  if (values.dense) {
    engines.push("dense");
  }

  if (values.bm25) {
    engines.push("bm25");
  }

  const runAllRetrieval = runAll || values.retrieval;

  if (runAllRetrieval && engines.length === 0) {
    engines.push("hybrid", "dense", "bm25");
  }

  if (runAll || values.ingestion) {
    await runIngestionEvaluation();
  }

  for (const engine of engines) {
    await runRetrievalEvaluation(engine);
  }
}

main().catch((error) => {
  console.error(error);

  process.exit(1);
});
