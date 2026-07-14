import { createEvaluationContainer } from "../src/bootstrap/createEvaluationContainer";
import { createDenseRetrievalEngine } from "../src/engines/retrieval/factories/create-dense-engine";
import cases from "./cases.json";

import { seedKnowledge } from "./seedKnowledge";

export async function runDenseEvaluation() {
  const container = createEvaluationContainer();

  await seedKnowledge(container.knowledgeIngestionUseCase);

  const retrievalEngine = createDenseRetrievalEngine(
    container.retrievalDependencies,
  );

  let success = 0;

  console.log("\nAtlas Dense Retrieval Evaluation\n");

  for (const testCase of cases) {
    const { results } = await retrievalEngine.retrieve(testCase.question);

    const found = results[0];

    const passed = found?.document.title === testCase.expectedDocument;

    if (passed) {
      success++;
    }

    console.log(`
      Question: ${testCase.question}
      Expected: ${testCase.expectedDocument}
      Found: ${found?.document.title ?? "none"}
      Score: ${found?.score ?? 0}
    `);
  }

  console.log(`
    Accuracy:
    ${((success / cases.length) * 100).toFixed(1)}%
  `);
}
