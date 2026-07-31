import { KnowledgeSearchResult } from "../../domain/search/models/knowledge-search-result";
import { FusionStrategy } from "./fusion.strategy";

export class RRFFusion implements FusionStrategy {
  constructor(private readonly k = 60) {}

  fuse(results: KnowledgeSearchResult[][]): KnowledgeSearchResult[] {
    const scores = new Map<string, number>();

    const documents = new Map<string, KnowledgeSearchResult>();

    for (const resultSet of results) {
      resultSet.forEach((result, index) => {
        const rank = index + 1;

        const id = result.chunk.id;

        const score = 1 / (this.k + rank);

        scores.set(id, (scores.get(id) ?? 0) + score);

        documents.set(id, result);
      });
    }

    return [...documents.entries()]
      .map(([id, result]) => ({
        ...result,
        score: scores.get(id) ?? 0,
      }))
      .sort((a, b) => b.score - a.score);
  }
}
