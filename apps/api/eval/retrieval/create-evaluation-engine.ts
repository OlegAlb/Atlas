import { createBM25RetrievalEngine } from "../../src/engines/retrieval/factories/create-bm25-engine";
import { createDenseRetrievalEngine } from "../../src/engines/retrieval/factories/create-dense-engine";
import { createHybridRetrievalEngine } from "../../src/engines/retrieval/factories/create-hybrid-engine";
import { RetrievalDependencies } from "../../src/engines/retrieval/factories/retrieval.dependencies";

export type RetrievalType = "bm25" | "dense" | "hybrid";

export function createEvaluationRetrievalEngine(
  type: RetrievalType,
  dependencies: RetrievalDependencies,
) {
  switch (type) {
    case "bm25":
      return createBM25RetrievalEngine(dependencies);

    case "dense":
      return createDenseRetrievalEngine(dependencies);

    case "hybrid":
      return createHybridRetrievalEngine(dependencies);
  }
}
