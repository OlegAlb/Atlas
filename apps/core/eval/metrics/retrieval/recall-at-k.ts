import { SearchResult } from "../../search/models/search-result.model";

export function recallAtK(result: SearchResult, k: number) {
  const retrieved = result.retrievedDocuments
    .slice(0, k)
    .map((item) => item.id);

  return result.relevantDocuments.some((id) => retrieved.includes(id)) ? 1 : 0;
}
