import { KnowledgeSearchResult } from "../../src/domain/knowledge/models/knowledge-search-result";
import { RetrievedDocument } from "./retrieval.models";

export function extractRetrievedDocuments(
  results: KnowledgeSearchResult[],
): RetrievedDocument[] {
  const documents = new Map<string, RetrievedDocument>();

  for (const result of results) {
    const id = result.document.id;

    const current = documents.get(id);

    if (!current || result.score > current.score) {
      documents.set(id, {
        id,
        title: result.document.title,
        score: result.score,
      });
    }
  }

  return [...documents.values()].sort((a, b) => b.score - a.score);
}
