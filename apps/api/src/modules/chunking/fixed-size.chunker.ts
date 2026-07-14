import { KnowledgeAsset } from "../knowledge/models/knowledge-asset";
import { ChunkCandidate, TextChunker } from "./text-chunker";

export class FixedSizeChunker implements TextChunker {
  constructor(
    private readonly chunkSize = 1000,
    private readonly overlap = 200,
  ) {}

  chunk(asset: KnowledgeAsset): ChunkCandidate[] {
    const chunks: ChunkCandidate[] = [];

    const text = asset.text;

    let start = 0;
    let order = 0;

    while (start < text.length) {
      const end = Math.min(start + this.chunkSize, text.length);

      chunks.push({
        order,
        text: text.slice(start, end),
        metadata: {},
      });

      order++;

      start += this.chunkSize - this.overlap;
    }

    return chunks;
  }
}
