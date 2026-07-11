import { Retriever } from "../retrievers/retriever";
import { RetrievalStep } from "./retrieval-step";
import { RetrievalContext } from "./retrieval.context";

export class KeywordRetrievalStep implements RetrievalStep {
  constructor(private readonly retriever: Retriever) {}

  async run(context: RetrievalContext) {
    const results = await this.retriever.retrieve(context.query);

    context.keywordResults = results;
    context.finalResults = results;

    return context;
  }
}
