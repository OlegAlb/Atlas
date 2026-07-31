import { KnowledgeChunk } from "../../../chunking/models/knowledge-chunk";

export interface BM25Document {
  id: string;

  terms: Record<string, number>;

  length: number;
}

export interface BM25Index {
  documents: BM25Document[];

  documentFrequency: Map<string, number>;

  averageDocumentLength: number;
}

export interface BM25Indexer {
  build(chunks: KnowledgeChunk[]): void;
  add(chunks: KnowledgeChunk[]): void;
  getIndex(): BM25Index;
}
