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

  async getById(id: KnowledgeChunk["id"]): Promise<KnowledgeChunk | undefined> {
    return this.chunks.find((chunk) => chunk.id === id);
  }

  async deleteByDocumentId(documentId: string): Promise<void> {
    this.chunks = this.chunks.filter(
      (chunk) => chunk.documentId !== documentId,
    );
  }
}
