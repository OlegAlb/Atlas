import { QueryProcessor } from "../query/query.processor";
import { Retriever } from "../retrievers/retriever";
import { RetrievalPipeline } from "./pipeline";
import { QueryExpansionStep } from "./steps/query-expansion.step";
import { RetrieverStep } from "./steps/retriever.step";

export function createRetrievalPipeline(
  retriever: Retriever,
  processor: QueryProcessor,
) {
  const queryExpansionStep = new QueryExpansionStep(processor);

  const retrieverStep = new RetrieverStep(retriever);

  return new RetrievalPipeline([queryExpansionStep, retrieverStep]);
}
