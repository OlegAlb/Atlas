import { ChunkMetadata } from "../../chunking/models/chunk-metadata";

export interface KnowledgeChunk {
  id?: string;
  documentId?: string;
  order: number;
  text: string;
  metadata: ChunkMetadata;
  createdAt?: Date;
}
