export interface KnowledgeDocument {
  id: string;
  title: string;
  createdAt: Date;
}

export interface KnowledgeChunk {
  id: string;
  documentId: string;
  text: string;
  order: number;
}

export interface KnowledgeSearchResult {
  document: KnowledgeDocument;
  chunk: KnowledgeChunk;
  score: number;
}
