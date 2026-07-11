export interface CreateKnowledgeDocumentDTO {
  title: string;
  content: string;
}

export interface CreateKnowledgeDocumentResult {
  documentId: string;
  chunksCount: number;
}
