import { QueryProcessor } from "../../query/query.processor";
import { RetrievalContext } from "../context";
import { RetrievalStep } from "../step";

export class QueryExpansionStep implements RetrievalStep {
  constructor(private readonly processor: QueryProcessor) {}

  async run(context: RetrievalContext): Promise<RetrievalContext> {
    return {
      ...context,
      queryTokens: this.processor.process(context.query),
    };
  }
}
