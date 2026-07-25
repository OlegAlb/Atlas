import { DocumentStore } from "../../infrastructure/storage/documents/document.store";

export class KnowledgeListUseCase {
  constructor(private readonly documentStore: DocumentStore) {}

  execute() {
    return this.documentStore.list();
  }
}
