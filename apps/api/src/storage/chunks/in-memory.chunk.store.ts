import { KnowledgeChunk } from "../../modules/knowledge/knowledge.types";
import { ChunkStore } from "./chunk.store";

export class InMemoryChunkStore implements ChunkStore {
  private chunks: KnowledgeChunk[] = [];

  async save(chunks: KnowledgeChunk[]): Promise<void> {
    this.chunks.push(...chunks);
  }

  async list(): Promise<KnowledgeChunk[]> {
    return [...this.chunks];
  }

  async deleteByDocumentId(documentId: string): Promise<void> {
    this.chunks = this.chunks.filter(
      (chunk) => chunk.documentId !== documentId,
    );
  }
}
