import { KnowledgeSearchResult } from "../../src/domain/search/models/knowledge-search-result";
import { RetrievedDocument } from "./models/retrieved-document.model";

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

  return [...documents.values()];
}
