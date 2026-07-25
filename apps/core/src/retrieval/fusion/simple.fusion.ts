import { KnowledgeSearchResult } from "../../../modules/knowledge/knowledge.types";
import { FusionStrategy } from "./fusion.strategy";

export class SimpleFusion implements FusionStrategy {
  fuse(groups: KnowledgeSearchResult[][]): KnowledgeSearchResult[] {
    const map = new Map<string, KnowledgeSearchResult>();

    for (const group of groups) {
      for (const result of group) {
        const existing = map.get(result.chunk.id);

        if (!existing || result.score > existing.score) {
          map.set(result.chunk.id, result);
        }
      }
    }

    return [...map.values()].sort((a, b) => b.score - a.score);
  }
}
