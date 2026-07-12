import { ChunkStore } from "../../storage/chunks/chunk.store";
import { DocumentStore } from "../../storage/documents/document.store";
import { ChunkCandidate, TextChunker } from "../chunking/text-chunker";
import { CreateKnowledgeDocumentDTO } from "./knowledge.dto";
import { KnowledgeIndexer } from "./knowledge.indexer";
import { KnowledgeDocument } from "./knowledge.types";

export interface IngestDocumentDTO {
  title: string;
  content: string;
}

export class KnowledgeIngestionUseCase {
  constructor(
    private documentStore: DocumentStore,
    private chunkStore: ChunkStore,
    private chunker: TextChunker,
    private knowledgeIndexer: KnowledgeIndexer,
  ) {}

  async execute(dto: CreateKnowledgeDocumentDTO) {
    const document = this.createDocument(dto);

    const candidates = this.chunker.split(document.content);

    const chunks = candidates.map((candidate) =>
      this.createChunk(candidate, document),
    );

    await this.documentStore.save(document);

    await this.chunkStore.save(chunks);

    await this.knowledgeIndexer.index(chunks);

    return {
      documentId: document.id,
      chunksCount: chunks.length,
    };
  }

  private createDocument(dto: CreateKnowledgeDocumentDTO) {
    return {
      id: crypto.randomUUID(),
      title: dto.title,
      content: dto.content,
      createdAt: new Date(),
    };
  }

  private createChunk(candidate: ChunkCandidate, document: KnowledgeDocument) {
    return {
      id: crypto.randomUUID(),
      documentId: document.id,
      order: candidate.order,
      text: candidate.text,
      createdAt: new Date(),
    };
  }
}
