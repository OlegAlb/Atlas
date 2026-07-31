import { ChatUseCase } from "../application/chat/chat.usecase";

import { KnowledgeIngestionUseCase } from "../application/knowledge/knowledge.ingestion.usecase";
import { KnowledgeService } from "../application/knowledge/knowledge.service";

import { EmbeddingIndexer } from "../application/knowledge/indexing/embedding.indexer";

import { KnowledgeIndexer } from "../application/knowledge/indexing/knowledge.indexer";
import { KnowledgeCreateUseCase } from "../application/knowledge/knowledge.create.usecase";
import { KnowledgeListUseCase } from "../application/knowledge/knowledge.list.usecase";
import { MetadataMerger, RecursiveChunker } from "../chunking";
import {
  createTokenizer,
  TokenizerType,
} from "../chunking/tokenizer/tokenizer.factory";
import { env } from "../config/env";
import { InMemoryConversationMemory } from "../infrastructure/conversation/in-memory-conversation.memory";
import { PlainTextLoader } from "../infrastructure/loaders/plain-text.loader";
import { PlainTextParser } from "../infrastructure/parsers/plain-text.parser";
import { InMemoryChunkStore } from "../infrastructure/storage/chunks/in-memory.chunk.store";
import { InMemoryDocumentStore } from "../infrastructure/storage/documents/in-memory.document.store";
import { InMemoryEmbeddingStore } from "../infrastructure/storage/embeddings/in-memory.embedding.store";
import { createEmbeddingProvider } from "../providers/embedding/embedding.factory";
import { createLLMProvider } from "../providers/llm/llm.factory";
import { createHybridSearchEngine } from "../search/factories/create-hybrid-search-engine";
import { SearchTracer } from "../search/observability/search.trace";
import { QueryProcessor } from "../search/query/query.processor";
import { createReranker } from "../search/reranking/create-reranker";
import { InMemoryBM25Indexer } from "../search/retrievers/bm25/in-memory-bm25.indexer";
import { InMemoryEmbeddingCache } from "../providers/embedding/cache/in-memory.embedding.cache";

export interface AppContainer {
  chatUseCase: ChatUseCase;

  knowledgeService: KnowledgeService;
  knowledgeCreateUseCase: KnowledgeCreateUseCase;
  knowledgeListUseCase: KnowledgeListUseCase;
}

export function createContainer(): AppContainer {
  const conversationMemory = new InMemoryConversationMemory();

  const documentStore = new InMemoryDocumentStore();

  const chunkStore = new InMemoryChunkStore();

  const tokenizer = createTokenizer(TokenizerType.GPT);

  const metadataMerger = new MetadataMerger();

  const chunker = new RecursiveChunker(tokenizer, metadataMerger);

  const processor = new QueryProcessor();

  const tracer = new SearchTracer();

  const reranker = createReranker();

  const embeddingProvider = createEmbeddingProvider();

  const embeddingStore = new InMemoryEmbeddingStore();

  const bm25Indexer = new InMemoryBM25Indexer();

  const searchDependencies = {
    tracer,
    reranker,
    processor,

    documentStore,
    chunkStore,

    embeddingProvider,
    embeddingStore,

    bm25Indexer,
  };

  const retrieval = createHybridSearchEngine(searchDependencies);

  const knowledgeService = new KnowledgeService(retrieval);

  const embeddingCache = new InMemoryEmbeddingCache();

  const embeddingIndexer = new EmbeddingIndexer(
    embeddingProvider,
    embeddingStore,
    embeddingCache,
  );

  const knowledgeIndexer = new KnowledgeIndexer(embeddingIndexer, bm25Indexer);

  const knowledgeIngestionUseCase = new KnowledgeIngestionUseCase(
    documentStore,
    chunkStore,
    chunker,
    knowledgeIndexer,
  );

  const plainTextLoader = new PlainTextLoader();

  const plainTextParser = new PlainTextParser();

  const knowledgeCreateUseCase = new KnowledgeCreateUseCase(
    plainTextLoader,
    plainTextParser,
    knowledgeIngestionUseCase,
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

    knowledgeCreateUseCase,

    knowledgeListUseCase,
  };
}
