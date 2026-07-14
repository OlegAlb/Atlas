import { KnowledgeAsset } from "../knowledge/models/knowledge-asset";

export interface ChunkCandidate {
  text: string;
  order: number;
  metadata: {
    section?: string;
    page?: number;
    heading?: string;
  };
}

export interface TextChunker {
  chunk(document: KnowledgeAsset): ChunkCandidate[];
}
