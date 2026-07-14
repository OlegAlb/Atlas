import { RetrievalTracer } from "../../observability/retrieval.trace";
import { Retriever } from "../../retrievers/retriever";
import { RetrievalContext } from "../context";
import { RetrievalStep } from "../step";

export class RetrieverStep implements RetrievalStep {
  constructor(
    private readonly retriever: Retriever,
    private readonly tracer: RetrievalTracer,
    private readonly name = "retriever",
  ) {}

  async run(context: RetrievalContext): Promise<RetrievalContext> {
    const trace = this.tracer.start(this.name);

    const results = await this.retriever.retrieve(context);

    this.tracer.finish(context, trace, results);

    return {
      ...context,
      results,
    };
  }
}
