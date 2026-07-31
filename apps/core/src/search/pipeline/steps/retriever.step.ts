import { SearchTracer } from "../../observability/search.trace";
import { Retriever } from "../../retrievers/retriever";
import { SearchContext } from "../context";
import { SearchStep } from "../step";

export class RetrieverStep implements SearchStep {
  constructor(
    private readonly retriever: Retriever,
    private readonly tracer: SearchTracer,
    private readonly name = "retriever",
  ) {}

  async run(context: SearchContext): Promise<SearchContext> {
    const trace = this.tracer.start(this.name);

    const results = await this.retriever.retrieve(context);

    this.tracer.finish(context, trace, results);

    return {
      ...context,
      results,
    };
  }
}
