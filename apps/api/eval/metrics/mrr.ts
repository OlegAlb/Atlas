import { KnowledgeSearchResult } from "../../src/modules/knowledge/knowledge.types";

export function reciprocalRank(
  results: KnowledgeSearchResult[],
  expectedTitle: string,
) {
  const index = results.findIndex(
    (item) => item.document.title === expectedTitle,
  );

  if (index === -1) {
    return 0;
  }

  return 1 / (index + 1);
}

export function mean(values: number[]) {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}
