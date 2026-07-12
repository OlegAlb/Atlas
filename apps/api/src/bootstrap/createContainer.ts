import { ChatUseCase } from "../modules/chat/chat.usecase";

import { FixedSizeChunker } from "../modules/chunking/fixed-size.chunker";
import { InMemoryConversationMemory } from "../modules/conversation/in-memory-conversation.memory";
import { KnowledgeIngestionUseCase } from "../modules/knowledge/knowledge.ingestion.usecase";
import { KnowledgeListUseCase } from "../modules/knowledge/knowledge.list.usecase";
import { KnowledgeService } from "../modules/knowledge/knowledge.service";

import { EmbeddingIndexer } from "../engines/embeddings/embedding.indexer";
import { createHybridRetrievalEngine } from "../engines/retrieval/factories/create-hybrid-engine";
import { QueryProcessor } from "../engines/retrieval/query/query.processor";
import { InMemoryBM25Indexer } from "../engines/retrieval/retrievers/bm25/in-memory-bm25.indexer";
import { createEmbeddingProvider } from "../infrastructure/embedding/embedding.factory";
import { createLLMProvider } from "../infrastructure/llm/llm.factory";
import { KnowledgeIndexer } from "../modules/knowledge/knowledge.indexer";
import { InMemoryChunkStore } from "../storage/chunks/in-memory.chunk.store";
import { InMemoryDocumentStore } from "../storage/documents/in-memory.document.store";
import { InMemoryEmbeddingStore } from "../storage/embeddings/in-memory.embedding.store";

export interface AppContainer {
  chatUseCase: ChatUseCase;

  knowledgeService: KnowledgeService;
  knowledgeIngestionUseCase: KnowledgeIngestionUseCase;
  knowledgeListUseCase: KnowledgeListUseCase;
}

export function createContainer(): AppContainer {
  const conversationMemory = new InMemoryConversationMemory();

  const documentStore = new InMemoryDocumentStore();

  const chunkStore = new InMemoryChunkStore();

  const chunker = new FixedSizeChunker();

  const processor = new QueryProcessor();

  const embeddingProvider = createEmbeddingProvider();

  const embeddingStore = new InMemoryEmbeddingStore();

  const bm25Indexer = new InMemoryBM25Indexer();

  const retrievalDependencies = {
    processor,

    documentStore,
    chunkStore,

    embeddingProvider,
    embeddingStore,

    bm25Indexer,
  };

  const retrievalEngine = createHybridRetrievalEngine(retrievalDependencies);

  const knowledgeService = new KnowledgeService(retrievalEngine);

  const embeddingIndexer = new EmbeddingIndexer(
    embeddingProvider,
    embeddingStore,
  );

  const knowledgeIndexer = new KnowledgeIndexer(embeddingIndexer, bm25Indexer);

  const knowledgeIngestionUseCase = new KnowledgeIngestionUseCase(
    documentStore,
    chunkStore,
    chunker,
    knowledgeIndexer,
  );

  const knowledgeListUseCase = new KnowledgeListUseCase(documentStore);

  const chatUseCase = new ChatUseCase(
    createLLMProvider(),
    conversationMemory,
    knowledgeService,
  );

  return {
    chatUseCase,

    knowledgeService,

    knowledgeIngestionUseCase,

    knowledgeListUseCase,
  };
}
