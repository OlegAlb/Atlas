import { Retriever } from "../../retrievers/retriever";
import { RetrievalContext } from "../context";
import { RetrievalStep } from "../step";

export class RetrieverStep implements RetrievalStep {
  constructor(
    private readonly retriever: Retriever,

    private readonly source: "keywordResults" | "denseResults",
  ) {}

  async run(context: RetrievalContext) {
    const results = await this.retriever.retrieve(context);

    context[this.source] = results;

    if (context.finalResults.length === 0) {
      context.finalResults = results;
    }

    return context;
  }
}
