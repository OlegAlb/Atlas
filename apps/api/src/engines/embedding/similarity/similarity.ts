import { Embedding } from "../embedding";

export interface Similarity {
  calculate(left: Embedding, right: Embedding): number;
}
