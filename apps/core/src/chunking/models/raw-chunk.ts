import { ChunkMetadata } from "./chunk-metadata";

export interface RawChunk {
  order: number;
  text: string;
  metadata: ChunkMetadata;
}
