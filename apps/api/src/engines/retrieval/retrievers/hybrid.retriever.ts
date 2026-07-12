import { FusionStrategy } from "../fusion/fusion.strategy";
import { KnowledgeSearchResult } from "../../../modules/knowledge/knowledge.types";
import { Retriever } from "./retriever";
import { RetrievalContext } from "../pipeline/context";

export class HybridRetriever implements Retriever {
  constructor(
    private readonly retrievers: Retriever[],
    private readonly fusion: FusionStrategy,
  ) {}

  async retrieve(
    context: RetrievalContext,
    limit = 3,
  ): Promise<KnowledgeSearchResult[]> {
    const results = await Promise.all(
      this.retrievers.map((retriever) => retriever.retrieve(context, limit)),
    );

    return this.fusion.fuse(results).slice(0, limit);
  }
}
