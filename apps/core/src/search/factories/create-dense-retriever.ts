import { CosineSimilarity } from "../../providers/embedding/similarity/cosine.similarity";
import { DenseRetriever } from "../retrievers/dense.retriever";
import { SearchDependencies } from "./search.dependencies";

export function createDenseRetriever(dependencies: SearchDependencies) {
  return new DenseRetriever(
    dependencies.embeddingProvider,
    dependencies.embeddingStore,
    dependencies.chunkStore,
    dependencies.documentStore,
    new CosineSimilarity(),
  );
}
