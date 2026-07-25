import { FusionStrategy } from "../fusion/fusion.strategy";
import { RetrievalTracer } from "../observability/retrieval.trace";
import { RetrievalContext } from "../pipeline/context";
import { NamedRetriever, Retriever } from "./retriever";

export class HybridRetriever implements Retriever {
  constructor(
    private readonly retrievers: NamedRetriever[],
    private readonly fusion: FusionStrategy,
    private readonly tracer: RetrievalTracer,
  ) {}

  async retrieve(context: RetrievalContext, limit = 10) {
    const results = await Promise.all(
      this.retrievers.map(async ({ name, retriever }) => {
        const startedAt = Date.now();

        const result = await retriever.retrieve(context, limit);

        this.tracer.record(context, name, Date.now() - startedAt, result);

        return result;
      }),
    );

    const startedAt = Date.now();

    const fused = this.fusion.fuse(results);

    this.tracer.record(context, "rrf", Date.now() - startedAt, fused);

    return fused.slice(0, limit);
  }
}
