import cases from "./cases.json";

import { createEvaluationContainer } from "../src/bootstrap/createEvaluationContainer";
import { seedKnowledge } from "./seedKnowledge";
import { createHybridRetrievalEngine } from "../src/engines/retrieval/factories/create-hybrid-engine";
import { recallAtK } from "./metrics/ndcg";
import { mean, reciprocalRank } from "./metrics/mrr";

export async function runHybridEvaluation() {
  const container = createEvaluationContainer();

  await seedKnowledge(container.knowledgeIngestionUseCase);

  const engine = createHybridRetrievalEngine(container.retrievalDependencies);

  const recallScores = [];
  const mrrScores = [];

  for (const testCase of cases) {
    const { results } = await engine.retrieve(testCase.question);

    recallScores.push(recallAtK(results, testCase.expectedDocument, 5));

    mrrScores.push(reciprocalRank(results, testCase.expectedDocument));

    console.log({
      question: testCase.question,

      top: results.map((x) => x.document.title),
    });
  }

  console.log({
    recallAt5: mean(recallScores),

    mrr: mean(mrrScores),
  });
}
