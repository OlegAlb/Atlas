export interface ChunkCandidate {
  text: string;
  order: number;
}

export interface TextChunker {
  split(text: string): ChunkCandidate[];
}
