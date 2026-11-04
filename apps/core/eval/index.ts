import { parseArgs } from "node:util";

import { runIngestionEvaluation } from "./runners/run-document-eval";
import { runRetrievalEvaluation } from "./runners/run-retrieval-eval";

import {
  EvaluationSearchConfig,
  RerankerType,
  SearchType,
} from "./search/models/evaluation-search-config.model";

const availableRerankers: RerankerType[] = ["noop", "jina", "reverse"];

const datasets = ["regression", "hard"] as const;

function getRerankers(selected?: string): RerankerType[] {
  if (!selected) {
    return ["noop"];
  }

  if (!availableRerankers.includes(selected as RerankerType)) {
    throw new Error(`Unsupported reranker: ${selected}`);
  }

  return [selected as RerankerType];
}

function addSearchConfigs(
  configs: EvaluationSearchConfig[],
  search: SearchType,
  rerankers: RerankerType[],
) {
  for (const reranker of rerankers) {
    configs.push({
      search,
      reranker,
    });
  }
}

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

      reranker: {
        type: "string",
      },
    },
  });

  const runAll =
    !values.ingestion &&
    !values.retrieval &&
    !values.hybrid &&
    !values.dense &&
    !values.bm25;

  const selectedRerankers = getRerankers(values.reranker);

  if (runAll || values.ingestion) {
    await runIngestionEvaluation();
  }

  const configs: EvaluationSearchConfig[] = [];

  if (runAll || values.retrieval || values.hybrid) {
    addSearchConfigs(configs, "hybrid", selectedRerankers);
  }

  if (runAll || values.retrieval || values.dense) {
    addSearchConfigs(configs, "dense", selectedRerankers);
  }

  if (runAll || values.retrieval || values.bm25) {
    addSearchConfigs(configs, "bm25", selectedRerankers);
  }

  for (const config of configs) {
    for (const datasetName of datasets) {
      await runRetrievalEvaluation({
        datasetName,
        config,
      });
    }
  }
}

main().catch((error) => {
  console.error(error);

  process.exit(1);
});
