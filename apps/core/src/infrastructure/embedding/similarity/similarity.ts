import { Embedding } from "../../../infrastructure/embedding/embedding.provider";

export interface Similarity {
  calculate(left: Embedding, right: Embedding): number;
}
