import { RetrievalResult } from "../../retrieval/retrieval.models";

export function ndcg(result: RetrievalResult, k: number) {
  const dcg = result.retrievedDocuments
    .slice(0, k)
    .reduce((sum, item, index) => {
      const relevance = result.relevantDocuments.includes(item.id) ? 1 : 0;

      return sum + relevance / Math.log2(index + 2);
    }, 0);

  const ideal = Math.min(result.relevantDocuments.length, k);

  const idcg = Array.from({ length: ideal }).reduce((sum: number, _, index) => {
    return sum + 1 / Math.log2(index + 2);
  }, 0);

  return idcg === 0 ? 0 : dcg / idcg;
}
