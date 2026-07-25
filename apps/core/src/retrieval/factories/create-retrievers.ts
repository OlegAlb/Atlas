import { CosineSimilarity } from "../../infrastructure/embedding/similarity/cosine.similarity";
import { RRFFusion } from "../fusion/rrf.fusion";
import { BM25Retriever } from "../retrievers/bm25/bm25.retriever";
import { BM25Scorer } from "../retrievers/bm25/bm25.scorer";
import { DenseRetriever } from "../retrievers/dense.retriever";
import { HybridRetriever } from "../retrievers/hybrid.retriever";
import { RetrievalDependencies } from "./retrieval.dependencies";

export function createRetrievers(dependencies: RetrievalDependencies) {
  const bm25Retriever = new BM25Retriever(
    dependencies.chunkStore,
    dependencies.documentStore,
    dependencies.bm25Indexer,
    new BM25Scorer(),
  );

  const denseRetriever = new DenseRetriever(
    dependencies.embeddingProvider,
    dependencies.embeddingStore,
    dependencies.chunkStore,
    dependencies.documentStore,
    new CosineSimilarity(),
  );

  const hybridRetriever = new HybridRetriever(
    [
      {
        name: "bm25",
        retriever: bm25Retriever,
      },
      {
        name: "dense",
        retriever: denseRetriever,
      },
    ],
    new RRFFusion(),
    dependencies.tracer,
  );

  return {
    bm25Retriever,
    denseRetriever,
    hybridRetriever,
  };
}
