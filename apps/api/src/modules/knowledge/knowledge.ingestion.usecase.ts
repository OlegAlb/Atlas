import { ChunkStore } from "../../storage/chunks/chunk.store";
import { DocumentStore } from "../../storage/documents/documents.store";
import { Chunker } from "../chunking";
import { KnowledgeDocument } from "../document/models/document";
import { KnowledgeIndexer } from "./knowledge.indexer";

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

    const chunks = this.chunker.chunk(storedDocument);

    await this.chunkStore.save(chunks);

    await this.indexer.index({
      document: storedDocument,
      chunks,
    });

    return storedDocument;
  }
}
