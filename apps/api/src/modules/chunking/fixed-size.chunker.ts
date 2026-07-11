import { ChunkCandidate, TextChunker } from "./text-chunker";

export class FixedSizeChunker implements TextChunker {
  constructor(
    private readonly chunkSize = 1000,
    private readonly overlap = 200,
  ) {}

  split(document: string): ChunkCandidate[] {
    const chunks: ChunkCandidate[] = [];

    let start = 0;
    let order = 0;

    while (start < document.length) {
      const end = Math.min(start + this.chunkSize, document.length);

      chunks.push({
        order,
        text: document.slice(start, end),
      });

      order++;

      start += this.chunkSize - this.overlap;
    }

    return chunks;
  }
}
