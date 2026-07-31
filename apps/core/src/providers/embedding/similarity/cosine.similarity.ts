import { Embedding } from "../models/embedding.model";
import { Similarity } from "./similarity";

export class CosineSimilarity implements Similarity {
  calculate(left: Embedding, right: Embedding): number {
    const a = left.values;
    const b = right.values;

    if (a.length !== b.length) {
      throw new Error("Embedding dimensions mismatch.");
    }

    let dot = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < a.length; i++) {
      dot += a[i] * b[i];

      normA += a[i] * a[i];

      normB += b[i] * b[i];
    }

    if (normA === 0 || normB === 0) {
      return 0;
    }

    return dot / (Math.sqrt(normA) * Math.sqrt(normB));
  }
}
