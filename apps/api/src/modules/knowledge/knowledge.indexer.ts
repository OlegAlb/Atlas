import { EmbeddingIndexer } from "../../engines/embeddings/embedding.indexer";
import { BM25Indexer } from "../../engines/retrieval/retrievers/bm25/bm25.indexer";
import { KnowledgeChunk } from "./knowledge.types";

export class KnowledgeIndexer {
  constructor(
    private readonly embeddingIndexer: EmbeddingIndexer,
    private readonly bm25Indexer: BM25Indexer,
  ) {}

  async index(chunks: KnowledgeChunk[]) {
    await this.embeddingIndexer.index(chunks);

    this.bm25Indexer.add(chunks);
  }
}
