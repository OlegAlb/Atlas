import { SearchResult } from "../../retrieval/retrieval.models";

export function reciprocalRank(result: SearchResult) {
  const index = result.retrievedDocuments.findIndex((item) =>
    result.relevantDocuments.includes(item.id),
  );

  if (index === -1) {
    return 0;
  }

  return 1 / (index + 1);
}
