import { RetrievalEngine } from "../../src/retrieval/retrieval.engine";
import { extractRetrievedDocuments } from "./extract-retrieved-documents";
import { RetrievalCase, RetrievalResult } from "./retrieval.models";

export class RetrievalEvaluator {
  constructor(private readonly engine: RetrievalEngine) {}

  async evaluate(cases: RetrievalCase[]): Promise<RetrievalResult[]> {
    const results: RetrievalResult[] = [];

    for (const testCase of cases) {
      const context = await this.engine.retrieve(testCase.query);

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
