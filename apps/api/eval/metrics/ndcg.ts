import { KnowledgeSearchResult } from "../../src/modules/knowledge/knowledge.types";

export function recallAtK(
  results: KnowledgeSearchResult[],
  expectedTitle: string,
  k: number,
) {
  return results
    .slice(0, k)
    .some((item) => item.document.title === expectedTitle)
    ? 1
    : 0;
}
