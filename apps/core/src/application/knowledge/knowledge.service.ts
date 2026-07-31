import { SearchEngine } from "../../search/search.engine";

export class KnowledgeService {
  constructor(private readonly retrieval: SearchEngine) {}

  search(query: string) {
    return this.retrieval.search(query);
  }
}
