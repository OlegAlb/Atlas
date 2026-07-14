import { NoopReranker } from "./noop.reranker";

export function createNoopReranker() {
  return new NoopReranker();
}
