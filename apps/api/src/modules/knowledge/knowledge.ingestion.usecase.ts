import { ChunkStore } from "../../storage/chunks/chunk.store";
import { DocumentStore } from "../../storage/documents/document.store";
import { FixedSizeChunker } from "../chunking/fixed-size.chunker";
import { CreateKnowledgeDocumentDTO } from "./knowledge.dto";

export interface IngestDocumentDTO {
  title: string;
  content: string;
}

export class KnowledgeIngestionUseCase {
  constructor(
    private documentStore: DocumentStore,
    private chunkStore: ChunkStore,
    private chunker: FixedSizeChunker,
  ) {}

  async execute(dto: CreateKnowledgeDocumentDTO) {
    const document = {
      id: crypto.randomUUID(),
      title: dto.title,
      content: dto.content,
      createdAt: new Date(),
    };

    const candidates = this.chunker.split(document.content);

    const chunks = candidates.map((candidate) => ({
      id: crypto.randomUUID(),
      documentId: document.id,
      order: candidate.order,
      text: candidate.text,
      createdAt: new Date(),
    }));

    await this.documentStore.save(document);

    await this.chunkStore.save(chunks);

    return {
      documentId: document.id,
      chunksCount: chunks.length,
    };
  }
}
