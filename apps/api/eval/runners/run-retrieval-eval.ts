import { createBM25RetrievalEngine } from "../../src/engines/retrieval/factories/create-bm25-engine";
import { createDenseRetrievalEngine } from "../../src/engines/retrieval/factories/create-dense-engine";
import { createHybridRetrievalEngine } from "../../src/engines/retrieval/factories/create-hybrid-engine";
import { RetrievalEvaluator } from "../retrieval/retrieval.evaluator";

import { mean } from "../metrics/retrieval/mean";
import { reciprocalRank } from "../metrics/retrieval/mrr";
import { ndcg } from "../metrics/retrieval/ndcg";
import { recallAtK } from "../metrics/retrieval/recall-at-k";

import cases from "../datasets/retrieval/cases.json";

import { createRetrievalEvaluationContainer } from "../bootstrap/createRetrievalEvaluationContainer";
import { seedRetrievalDataset } from "../seed/seed-retrieval-dataset";
import {
  createEvaluationRetrievalEngine,
  RetrievalType,
} from "../retrieval/create-evaluation-engine";

export async function runRetrievalEvaluation(type: RetrievalType) {
  const container = createRetrievalEvaluationContainer();

  await seedRetrievalDataset(container.knowledgeIngestionUseCase);

  const engine = createEvaluationRetrievalEngine(
    type,
    container.retrievalDependencies,
  );

  const evaluator = new RetrievalEvaluator(engine);

  const results = await evaluator.evaluate(cases);

  const recallScores = results.map((result) => recallAtK(result, 5));

  const mrrScores = results.map(reciprocalRank);

  const ndcgScores = results.map((result) => ndcg(result, 5));

  console.log(`\n${type.toUpperCase()}`);

  console.table({
    recallAt5: mean(recallScores),

    mrr: mean(mrrScores),

    ndcg: mean(ndcgScores),
  });
}
