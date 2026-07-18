import { DocumentStore } from "../../storage/documents/documents.store";

export class KnowledgeListUseCase {
  constructor(private readonly documentStore: DocumentStore) {}

  execute() {
    return this.documentStore.list();
  }
}
