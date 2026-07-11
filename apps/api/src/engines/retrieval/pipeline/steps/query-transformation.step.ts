import { QueryProcessor } from "../../query/query.processor";
import { RetrievalContext } from "../context";
import { RetrievalStep } from "../step";

export class QueryTransformationStep implements RetrievalStep {
  constructor(private readonly processor: QueryProcessor) {}

  async run(context: RetrievalContext) {
    const tokens = this.processor.process(context.query);

    context.queryTokens = tokens;

    context.transformedQuery = tokens.join(" ");

    return context;
  }
}
