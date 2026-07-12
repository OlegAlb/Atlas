import { Retriever } from "../../retrievers/retriever";
import { RetrievalContext } from "../context";
import { RetrievalStep } from "../step";

export class RetrieverStep implements RetrievalStep {
  constructor(private readonly retriever: Retriever) {}

  async run(context: RetrievalContext): Promise<RetrievalContext> {
    const results = await this.retriever.retrieve(context);

    return {
      ...context,
      results,
    };
  }
}
