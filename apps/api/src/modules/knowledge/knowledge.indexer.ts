import { BM25Indexer } from "../../engines/retrieval/retrievers/bm25/bm25.indexer";
import { KnowledgeDocument } from "../document/models/document";
import { KnowledgeChunk } from "./models/knowledge-chunk";

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
