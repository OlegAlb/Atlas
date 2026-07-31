import { SearchTracer } from "../../observability/search.trace";
import { Reranker } from "../../reranking/reranker";
import { SearchContext } from "../context";
import { SearchStep } from "../step";

export class RerankerStep implements SearchStep {
  constructor(
    private readonly reranker: Reranker,
    private readonly tracer: SearchTracer,
  ) {}

  async run(context: SearchContext): Promise<SearchContext> {
    const trace = this.tracer.start("reranker");

    const results = await this.reranker.rerank(
      context.query,
      context.results,
      5,
    );

    this.tracer.finish(context, trace, results);

    return {
      ...context,
      results,
    };
  }
}
