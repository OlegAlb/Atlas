import { runHybridEvaluation } from "./run-hybrid-evaluation";
import { runDenseEvaluation } from "./run-dense-evaluation";
import { parseArgs } from "node:util";
import { runBM25Evaluation } from "./run-bm25-evaluation";

async function main() {
  const { values } = parseArgs({
    options: {
      hybrid: { type: "boolean" },
      dense: { type: "boolean" },
      bm25: { type: "boolean" },
    },
  });

  const runAll = !values.hybrid && !values.dense && !values.bm25;

  if (runAll || values.hybrid) {
    await runHybridEvaluation();
  }

  if (runAll || values.dense) {
    await runDenseEvaluation();
  }

  if (runAll || values.bm25) {
    await runBM25Evaluation();
  }
}

main().catch((err) => {
  console.error("Ошибка при выполнении:", err);
  process.exit(1);
});
