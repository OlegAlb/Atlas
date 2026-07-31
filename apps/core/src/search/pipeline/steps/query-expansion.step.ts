import { QueryProcessor } from "../../query/query.processor";
import { SearchContext } from "../context";
import { SearchStep } from "../step";

export class QueryExpansionStep implements SearchStep {
  constructor(private readonly processor: QueryProcessor) {}

  async run(context: SearchContext): Promise<SearchContext> {
    return {
      ...context,
      queryTokens: this.processor.process(context.query),
    };
  }
}
