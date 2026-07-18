import { createEvaluationContainer } from "../src/bootstrap/createEvaluationContainer";
import { createBM25RetrievalEngine } from "../src/engines/retrieval/factories/create-bm25-engine";
import cases from "./cases.json";
import { seedKnowledge } from "./seedKnowledge";

export async function runBM25Evaluation() {
  const container = createEvaluationContainer();

  await seedKnowledge(container.knowledgeIngestionUseCase);

  const retrievalEngine = createBM25RetrievalEngine(
    container.retrievalDependencies,
  );

  let success = 0;

  for (const testCase of cases) {
    const { results } = await retrievalEngine.retrieve(testCase.question);

    const found = results[0];

    const passed = found?.document.title === testCase.expectedDocument;

    if (passed) {
      success++;
    }

    console.log({
      question: testCase.question,
      expected: testCase.expectedDocument,
      found: found?.document.title,
      score: found?.score,
    });
  }

  console.log(
    `Accuracy:
    ${((success / cases.length) * 100).toFixed(1)}%`,
  );
}
