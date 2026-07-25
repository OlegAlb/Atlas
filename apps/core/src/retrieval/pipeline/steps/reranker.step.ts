import { Reranker } from "../../../../modules/rerankers/reranker";
import { RetrievalTracer } from "../../observability/retrieval.trace";
import { RetrievalContext } from "../context";
import { RetrievalStep } from "../step";

export class RerankerStep implements RetrievalStep {
  constructor(
    private readonly reranker: Reranker,
    private readonly tracer: RetrievalTracer,
  ) {}

  async run(context: RetrievalContext): Promise<RetrievalContext> {
    const trace = this.tracer.start("reranker");

    const results = await this.reranker.rerank(context.query, context.results);

    this.tracer.finish(context, trace, results);

    return {
      ...context,
      results,
    };
  }
}
