import { mean } from "../metrics/retrieval/mean";
import { reciprocalRank } from "../metrics/retrieval/mrr";
import { ndcg } from "../metrics/retrieval/ndcg";
import { recallAtK } from "../metrics/retrieval/recall-at-k";

import { createRetrievalEvaluationContainer } from "../bootstrap/createRetrievalEvaluationContainer";

import { createEvaluationSearchEngine } from "../search/create-evaluation";
import { RetrievalEvaluator } from "../search/retrieval.evaluator";
import { seedRetrievalDataset } from "../seed/seed-retrieval-dataset";
import { EvaluationSearchConfig } from "../search/models/evaluation-search-config.model";
import { getRetrievalCases } from "../datasets/loaders/retrieval-dataset.loader";
import { getRetrievalCorpus } from "../datasets/loaders/retrieval-corpus.loader";

export interface RetrievalEvaluationOptions {
  datasetName: string;
  config: EvaluationSearchConfig;
}

export async function runRetrievalEvaluation(
  options: RetrievalEvaluationOptions,
) {
  const container = createRetrievalEvaluationContainer(options.config);

  await seedRetrievalDataset(
    container.knowledgeIngestionUseCase,
    getRetrievalCorpus(options.datasetName),
  );

  const engine = createEvaluationSearchEngine(
    options.config,
    container.searchDependencies,
  );

  const evaluator = new RetrievalEvaluator(engine);

  const results = await evaluator.evaluate(
    getRetrievalCases(options.datasetName),
  );

  console.log(
    `${options.datasetName} | ${options.config.search} + ${options.config.reranker}`,
  );

  console.table({
    recallAt5: mean(results.map((result) => recallAtK(result, 5))),

    mrr: mean(results.map(reciprocalRank)),

    ndcg: mean(results.map((result) => ndcg(result, 5))),
  });
}
