import { KnowledgeChunk } from "../../../chunking/models/knowledge-chunk";
import { KnowledgeDocument } from "../../../domain/document/models/document";
import { EmbeddingIndexer } from "./embedding.indexer";
import { BM25Indexer } from "./bm25.indexer";

export interface IndexPayload {
  document: KnowledgeDocument;
  chunks: KnowledgeChunk[];
}

export class KnowledgeIndexer {
  constructor(
    private readonly embeddingIndexer: EmbeddingIndexer,
    private readonly bm25Indexer: BM25Indexer,
  ) {}

  async index(payload: IndexPayload) {
    await this.embeddingIndexer.index(payload.chunks);

    this.bm25Indexer.add(payload.chunks);
  }
}
