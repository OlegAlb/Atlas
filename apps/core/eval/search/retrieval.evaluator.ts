import { SearchEngine } from "../../src/search/search.engine";
import { extractRetrievedDocuments } from "./extract-retrieved-documents";
import { SearchCase } from "./models/search-case.model";
import { SearchResult } from "./models/search-result.model";

export class RetrievalEvaluator {
  constructor(private readonly engine: SearchEngine) {}

  async evaluate(cases: SearchCase[]): Promise<SearchResult[]> {
    const results: SearchResult[] = [];

    for (const testCase of cases) {
      const context = await this.engine.search(testCase.query);

      results.push({
        caseId: testCase.id,

        query: testCase.query,

        relevantDocuments: testCase.relevantDocuments,

        retrievedDocuments: extractRetrievedDocuments(context.results),
      });
    }

    return results;
  }
}
