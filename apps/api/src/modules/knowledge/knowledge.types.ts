export interface KnowledgeDocument {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
}

export interface KnowledgeChunk {
  id: string;
  documentId: string;
  text: string;
  order: number;
  createdAt: Date;
}

export interface KnowledgeSearchResult {
  document: KnowledgeDocument;
  chunk: KnowledgeChunk;
  score: number;

  source?: "keyword" | "dense" | "bm25";
}
