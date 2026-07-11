import { Retriever } from "./retrievers/retriever";

export class RetrievalEngine {
  constructor(private readonly retriever: Retriever) {}

  retrieve(query: string, limit?: number) {
    return this.retriever.retrieve(query, limit);
  }
}
