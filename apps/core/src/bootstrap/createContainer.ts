import { ChatUseCase } from "../application/chat/chat.usecase";

import { KnowledgeIngestionUseCase } from "../application/knowledge/knowledge.ingestion.usecase";
import { KnowledgeService } from "../application/knowledge/knowledge.service";

import { EmbeddingIndexer } from "../infrastructure/embedding/embedding.indexer";
import { createEmbeddingProvider } from "../infrastructure/embedding/embedding.factory";
import { createLLMProvider } from "../infrastructure/llm/llm.factory";

import { KnowledgeIndexer } from "../application/knowledge/knowledge.indexer";
import { KnowledgeListUseCase } from "../application/knowledge/knowledge.list.usecase";
import { InMemoryConversationMemory } from "../infrastructure/conversation/in-memory-conversation.memory";
import { InMemoryDocumentStore } from "../infrastructure/storage/documents/in-memory.document.store";
import { InMemoryChunkStore } from "../infrastructure/storage/chunks/in-memory.chunk.store";
import {
  createTokenizer,
  TokenizerType,
} from "../chunking/tokenizer/tokenizer.factory";
import { MetadataMerger, RecursiveChunker } from "../chunking";
import { QueryProcessor } from "../retrieval/query/query.processor";
import { RetrievalTracer } from "../retrieval/observability/retrieval.trace";
import { NoopReranker } from "../infrastructure/rerankers/noop.reranker";
import { InMemoryEmbeddingStore } from "../infrastructure/storage/embeddings/in-memory.embedding.store";
import { InMemoryBM25Indexer } from "../retrieval/retrievers/bm25/in-memory-bm25.indexer";
import { createHybridRetrievalEngine } from "../retrieval/factories/create-hybrid-engine";
import { KnowledgeCreateUseCase } from "../application/knowledge/knowledge.create.usecase";
import { PlainTextLoader } from "../infrastructure/loaders/plain-text.loader";
import { PlainTextParser } from "../infrastructure/parsers/plain-text.parser";

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

  const tracer = new RetrievalTracer();

  const reranker = new NoopReranker();

  const embeddingProvider = createEmbeddingProvider();

  const embeddingStore = new InMemoryEmbeddingStore();

  const bm25Indexer = new InMemoryBM25Indexer();

  const retrievalDependencies = {
    tracer,
    reranker,
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
