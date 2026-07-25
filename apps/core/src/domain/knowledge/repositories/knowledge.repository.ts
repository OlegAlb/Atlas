import { KnowledgeChunk } from "../../../chunking/models/knowledge-chunk";
import { KnowledgeDocument } from "../../document/models/document";

export interface KnowledgeRepository {
  save(document: KnowledgeDocument, chunks: KnowledgeChunk[]): Promise<void>;

  listDocuments(): Promise<KnowledgeDocument[]>;

  getDocumentById(id: string): Promise<KnowledgeDocument | null>;

  listChunks(): Promise<KnowledgeChunk[]>;
}
