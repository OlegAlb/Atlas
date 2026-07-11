import { KnowledgeSearchResult } from "../../../modules/knowledge/knowledge.types";
import { RetrievalContext } from "../pipeline/context";
import { Retriever } from "./retriever";

export class HybridRetriever implements Retriever {
  constructor(private readonly retrievers: Retriever[]) {}

  async retrieve(
    context: RetrievalContext,
    limit = 10,
  ): Promise<KnowledgeSearchResult[]> {
    const results = await Promise.all(
      this.retrievers.map((retriever) => retriever.retrieve(context, limit)),
    );

    return this.merge(results);
  }

  private merge(groups: KnowledgeSearchResult[][]) {
    const map = new Map<string, KnowledgeSearchResult>();

    for (const group of groups) {
      for (const result of group) {
        const key = result.chunk.id;

        const existing = map.get(key);

        if (!existing || result.score > existing.score) {
          map.set(key, result);
        }
      }
    }

    return [...map.values()].sort((a, b) => b.score - a.score);
  }
}
