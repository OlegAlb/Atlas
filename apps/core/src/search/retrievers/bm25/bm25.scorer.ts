import {
  BM25Document,
  BM25Index,
} from "../../../application/knowledge/indexing/bm25.indexer";

export class BM25Scorer {
  constructor(
    private readonly k1 = 1.2,
    private readonly b = 0.75,
  ) {}

  score(query: string[], document: BM25Document, index: BM25Index) {
    let score = 0;

    for (const term of query) {
      const tf = document.terms[term] ?? 0;

      if (!tf) {
        continue;
      }

      const df = index.documentFrequency.get(term) ?? 0;

      const idf = Math.log(
        (index.documents.length - df + 0.5) / (df + 0.5) + 1,
      );

      const numerator = tf * (this.k1 + 1);

      const denominator =
        tf +
        this.k1 *
          (1 -
            this.b +
            this.b * (document.length / index.averageDocumentLength));

      score += idf * (numerator / denominator);
    }

    return score;
  }
}
