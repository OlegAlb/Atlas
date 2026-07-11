import cases from "./cases.json";

import { createContainer } from "../src/bootstrap/createContainer";
import { seedKnowledge } from "./fixtures";

export async function runEvaluation() {
  const container = createContainer();

  await seedKnowledge(container);

  const knowledge = container.knowledgeService;

  let success = 0;

  console.log("\nAtlas RAG Evaluation\n");

  for (const testCase of cases) {
    const results = await knowledge.retrieve(testCase.question);

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

Score:
${found?.score ?? 0}
`);
  }

  console.log(`
Accuracy:
${((success / cases.length) * 100).toFixed(1)}%
`);
}
