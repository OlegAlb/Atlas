import { KnowledgeDocument } from "../documents/models/document";
import { KnowledgeChunk } from "./models/knowledge-chunk";

export interface KnowledgeRepository {
  save(document: KnowledgeDocument, chunks: KnowledgeChunk[]): Promise<void>;

  listDocuments(): Promise<KnowledgeDocument[]>;

  getDocumentById(id: string): Promise<KnowledgeDocument | null>;

  listChunks(): Promise<KnowledgeChunk[]>;
}
