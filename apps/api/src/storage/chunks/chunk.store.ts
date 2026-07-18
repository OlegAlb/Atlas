import { KnowledgeChunk } from "../../modules/knowledge/models/knowledge-chunk";

export interface ChunkStore {
  save(chunks: KnowledgeChunk[]): Promise<void>;

  list(): Promise<KnowledgeChunk[]>;

  getById(chunkId: KnowledgeChunk["id"]): Promise<KnowledgeChunk | undefined>;

  deleteByDocumentId(documentId: string): Promise<void>;
}
