import { ChatUseCase } from "../modules/chat/chat.usecase";

import { KnowledgeService } from "../modules/knowledge/knowledge.service";
import { KnowledgeIngestionUseCase } from "../modules/knowledge/knowledge.ingestion.usecase";
import { InMemoryConversationMemory } from "../modules/conversation/in-memory-conversation.memory";
import { GroqProvider } from "../infrastructure/llm/groq.provider";
import { FixedSizeChunker } from "../modules/chunking/fixed-size.chunker";
import { KnowledgeListUseCase } from "../modules/knowledge/knowledge.list.usecase";

import { InMemoryDocumentStore } from "../storage/documents/in-memory.document.store";
import { QueryProcessor } from "../engines/retrieval/query/query.processor";
import { KeywordScorer } from "../engines/retrieval/scoring/keyword.scorer";
import { KeywordRetriever } from "../engines/retrieval/retrievers/keyword.retriever";
import { RetrievalEngine } from "../engines/retrieval/retrieval.engine";
import { InMemoryChunkStore } from "../storage/chunks/in-memory.chunk.store";
import { KeywordRetrievalStep } from "../engines/retrieval/pipeline/keyword-retrieval.step";
import { RetrievalPipeline } from "../engines/retrieval/pipeline/retrieval.pipeline";

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

  // Retrieval

  const processor = new QueryProcessor();

  const scorer = new KeywordScorer();

  const keywordRetriever = new KeywordRetriever(
    chunkStore,
    documentStore,
    processor,
    scorer,
  );

  const keywordStep = new KeywordRetrievalStep(keywordRetriever);

  const pipeline = new RetrievalPipeline([keywordStep]);

  const retrievalEngine = new RetrievalEngine(pipeline);

  // Services

  const knowledgeService = new KnowledgeService(retrievalEngine);

  // Use cases

  const knowledgeIngestionUseCase = new KnowledgeIngestionUseCase(
    documentStore,
    chunkStore,
    chunker,
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
