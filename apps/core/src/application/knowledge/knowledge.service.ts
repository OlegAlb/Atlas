import { RetrievalEngine } from "../../retrieval/retrieval.engine";

export class KnowledgeService {
  constructor(private readonly retrievalEngine: RetrievalEngine) {}

  retrieve(query: string) {
    return this.retrievalEngine.retrieve(query);
  }
}
