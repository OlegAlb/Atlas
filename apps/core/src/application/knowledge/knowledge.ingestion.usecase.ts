import { Chunker } from "../../chunking";
import { KnowledgeDocument } from "../../domain/document/models/document";
import { ChunkStore } from "../../infrastructure/storage/chunks/chunk.store";
import { DocumentStore } from "../../infrastructure/storage/documents/document.store";
import { KnowledgeIndexer } from "./indexing/knowledge.indexer";

export interface IngestDocumentDTO {
  title: string;
  content: string;
}

export class KnowledgeIngestionUseCase {
  constructor(
    private readonly documentStore: DocumentStore,
    private readonly chunkStore: ChunkStore,
    private readonly chunker: Chunker,
    private readonly indexer: KnowledgeIndexer,
  ) {}

  async execute(document: KnowledgeDocument) {
    const storedDocument = await this.documentStore.save(document);

    const rawChunks = this.chunker.chunk(storedDocument);

    const chunks = rawChunks.map((chunk) => ({
      ...chunk,
      id: crypto.randomUUID(),
      documentId: storedDocument.id,
      createdAt: new Date(),
    }));

    await this.chunkStore.save(chunks);

    await this.indexer.index({
      document: storedDocument,
      chunks,
    });

    return storedDocument;
  }
}
