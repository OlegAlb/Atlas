import { KnowledgeChunk, KnowledgeDocument } from "./knowledge.types";

export interface KnowledgeRepository {
  save(document: KnowledgeDocument, chunks: KnowledgeChunk[]): Promise<void>;

  listDocuments(): Promise<KnowledgeDocument[]>;

  getDocumentById(id: string): Promise<KnowledgeDocument | null>;

  listChunks(): Promise<KnowledgeChunk[]>;
}
