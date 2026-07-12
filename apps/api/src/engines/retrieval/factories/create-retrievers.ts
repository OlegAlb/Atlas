import { BM25Retriever } from "../retrievers/bm25/bm25.retriever";
import { DenseRetriever } from "../retrievers/dense.retriever";
import { HybridRetriever } from "../retrievers/hybrid.retriever";
import { RetrievalDependencies } from "./retrieval.dependencies";

export function createRetrievers(deps: RetrievalDependencies) {
  const bm25Retriever = new BM25Retriever(
    deps.chunkStore,
    deps.documentStore,
    deps.bm25Indexer,
    deps.bm25Scorer,
  );

  const denseRetriever = new DenseRetriever(
    deps.embeddingProvider,
    deps.embeddingStore,
    deps.chunkStore,
    deps.documentStore,
    deps.similarity,
  );

  const hybridRetriever = new HybridRetriever(
    [bm25Retriever, denseRetriever],
    deps.fusion,
  );

  return {
    bm25Retriever,
    denseRetriever,
    hybridRetriever,
  };
}
