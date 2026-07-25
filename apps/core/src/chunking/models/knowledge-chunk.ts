import { ChunkMetadata } from "./chunk-metadata";

export interface KnowledgeChunk {
  id: string;
  documentId: string;
  order: number;
  text: string;
  metadata: ChunkMetadata;
  createdAt?: Date;
}
