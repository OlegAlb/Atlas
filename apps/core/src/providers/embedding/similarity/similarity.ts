import { Embedding } from "../models/embedding.model";

export interface Similarity {
  calculate(left: Embedding, right: Embedding): number;
}
