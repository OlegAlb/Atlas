import { InMemoryConversationMemory } from "../../../modules/conversation/in-memory-conversation.memory";
import { InMemoryChunkStore } from "../../../storage/chunks/in-memory.chunk.store";
import { InMemoryDocumentStore } from "../../../storage/documents/in-memory.document.store";
import { QueryProcessor } from "../query/query.processor";
import { KeywordRetriever } from "../retrievers/keyword.retriever";
import { KeywordScorer } from "../scoring/keyword.scorer";
import { RetrievalPipeline } from "./pipeline";
import { QueryTransformationStep } from "./steps/query-transformation.step";
import { RetrieverStep } from "./steps/retriever.step";

export function createRetrievalPipeline(
  documentStore: InMemoryDocumentStore,
  chunkStore: InMemoryChunkStore,
) {
  const processor = new QueryProcessor();

  const scorer = new KeywordScorer();

  const keywordRetriever = new KeywordRetriever(
    chunkStore,
    documentStore,
    processor,
    scorer,
  );

  const queryTransformationStep = new QueryTransformationStep(processor);

  const keywordStep = new RetrieverStep(keywordRetriever, "keywordResults");

  return new RetrievalPipeline([queryTransformationStep, keywordStep]);
}
