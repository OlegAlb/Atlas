import {
  BM25Document,
  BM25Index,
  BM25Indexer,
} from "../../../application/knowledge/indexing/bm25.indexer";
import { KnowledgeChunk } from "../../../chunking/models/knowledge-chunk";
import { countTerms, tokenize } from "./bm25.utils";

export class InMemoryBM25Indexer implements BM25Indexer {
  documents: BM25Document[] = [];

  documentFrequency = new Map<string, number>();

  averageDocumentLength = 0;

  build(chunks: KnowledgeChunk[]) {
    this.documents = [];

    this.documentFrequency.clear();

    this.add(chunks);
  }

  add(chunks: KnowledgeChunk[]) {
    const newDocuments = chunks.map((chunk) => {
      const terms = tokenize(chunk.text);

      return {
        id: chunk.id,
        terms: countTerms(terms),
        length: terms.length,
      };
    });

    this.documents.push(...newDocuments);

    this.calculateStatistics();
  }

  getIndex(): BM25Index {
    return {
      documents: this.documents,
      documentFrequency: this.documentFrequency,
      averageDocumentLength: this.averageDocumentLength,
    };
  }

  private calculateStatistics() {
    this.documentFrequency.clear();

    let totalLength = 0;

    for (const doc of this.documents) {
      totalLength += doc.length;

      for (const term of Object.keys(doc.terms)) {
        const count = this.documentFrequency.get(term) ?? 0;

        this.documentFrequency.set(term, count + 1);
      }
    }

    this.averageDocumentLength = totalLength / this.documents.length;
  }
}
