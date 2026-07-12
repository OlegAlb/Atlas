import { ChatUseCase } from "../modules/chat/chat.usecase";

import { GroqProvider } from "../infrastructure/llm/groq.provider";
import { FixedSizeChunker } from "../modules/chunking/fixed-size.chunker";
import { InMemoryConversationMemory } from "../modules/conversation/in-memory-conversation.memory";
import { KnowledgeIngestionUseCase } from "../modules/knowledge/knowledge.ingestion.usecase";
import { KnowledgeListUseCase } from "../modules/knowledge/knowledge.list.usecase";
import { KnowledgeService } from "../modules/knowledge/knowledge.service";

import { createRetrievalPipeline } from "../engines/retrieval/pipeline/create-retrieval-pipeline";
import { RetrievalEngine } from "../engines/retrieval/retrieval.engine";
import { InMemoryChunkStore } from "../storage/chunks/in-memory.chunk.store";
import { InMemoryDocumentStore } from "../storage/documents/in-memory.document.store";
import { FakeEmbeddingModel } from "../engines/embedding/fake.embedding.model";
import { InMemoryEmbeddingStore } from "../storage/embeddings/in-memory.embedding.store";
import { EmbeddingIndexService } from "../engines/embedding/embedding.index.service";
import { QueryProcessor } from "../engines/retrieval/query/query.processor";
import { KeywordScorer } from "../engines/retrieval/scoring/keyword.scorer";
import { KeywordRetriever } from "../engines/retrieval/retrievers/keyword.retriever";
import { DenseRetriever } from "../engines/retrieval/retrievers/dense.retriever";
import { CosineSimilarity } from "../engines/embedding/similarity/cosine.similarity";
import { SimpleFusion } from "../engines/retrieval/fusion/simple.fusion";
import { HybridRetriever } from "../engines/retrieval/retrievers/hybrid.retriever";

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

  const llmProvider = new GroqProvider();

  const chunker = new FixedSizeChunker();

  const embeddingModel = new FakeEmbeddingModel();

  const embeddingStore = new InMemoryEmbeddingStore();

  const processor = new QueryProcessor();

  const scorer = new KeywordScorer();

  const similarity = new CosineSimilarity();

  const fusion = new SimpleFusion();

  const keywordRetriever = new KeywordRetriever(
    chunkStore,
    documentStore,
    scorer,
  );

  const denseRetriever = new DenseRetriever(
    embeddingModel,
    embeddingStore,
    chunkStore,
    documentStore,
    similarity,
  );

  const hybridRetriever = new HybridRetriever(
    [keywordRetriever, denseRetriever],
    fusion,
  );

  // Retrieval

  const pipeline = createRetrievalPipeline(hybridRetriever, processor);

  const retrievalEngine = new RetrievalEngine(pipeline);

  // Services

  const knowledgeService = new KnowledgeService(retrievalEngine);

  const embeddingIndexService = new EmbeddingIndexService(
    embeddingModel,
    embeddingStore,
  );

  // Use cases

  const knowledgeIngestionUseCase = new KnowledgeIngestionUseCase(
    documentStore,
    chunkStore,
    chunker,
    embeddingIndexService,
  );

  const knowledgeListUseCase = new KnowledgeListUseCase(documentStore);

  const chatUseCase = new ChatUseCase(
    llmProvider,
    conversationMemory,
    knowledgeService,
  );

  return {
    chatUseCase,
    knowledgeService,
    knowledgeListUseCase,
    knowledgeIngestionUseCase,
  };
}
