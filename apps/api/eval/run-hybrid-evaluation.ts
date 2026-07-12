import cases from "./cases.json";

import { createEvaluationContainer } from "../src/bootstrap/createEvaluationContainer";
import { seedKnowledge } from "./fixtures";
import { createHybridRetrievalEngine } from "../src/engines/retrieval/factories/create-hybrid-engine";

export async function runHybridEvaluation() {
  const container = createEvaluationContainer();

  await seedKnowledge(container.knowledgeIngestionUseCase);

  const retrievalEngine = createHybridRetrievalEngine(
    container.retrievalDependencies,
  );

  let success = 0;

  console.log("\nAtlas RAG Evaluation\n");

  for (const testCase of cases) {
    const results = await retrievalEngine.retrieve(testCase.question);

    const found = results[0];

    const passed = found?.document.title === testCase.expectedTitle;

    if (passed) {
      success++;
    }

    console.log(`
      ${passed ? "✅" : "❌"}

      Question:
      ${testCase.question}

      Expected:
      ${testCase.expectedTitle}

      Found:
      ${found?.document.id ?? "none"}

      Top result:
      ${found?.document.title}

      Source:
      ${found?.source}

      Score:
      ${found?.score ?? 0}
    `);
  }

  console.log(`
    Accuracy: ${((success / cases.length) * 100).toFixed(1)}%
  `);
}
