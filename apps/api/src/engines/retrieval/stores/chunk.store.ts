import { KnowledgeChunk } from "../../../modules/knowledge/knowledge.types";

export interface ChunkStore {
  save(chunks: KnowledgeChunk[]): Promise<void>;

  list(): Promise<KnowledgeChunk[]>;
}
