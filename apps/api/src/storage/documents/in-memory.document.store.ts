import { DocumentStore } from "./document.store";

import { KnowledgeDocument } from "../../modules/knowledge/knowledge.types";

export class InMemoryDocumentStore implements DocumentStore {
  private readonly documents: KnowledgeDocument[] = [];

  async save(document: KnowledgeDocument): Promise<void> {
    this.documents.push(document);
  }

  async list(): Promise<KnowledgeDocument[]> {
    return [...this.documents];
  }

  async getById(id: string): Promise<KnowledgeDocument | null> {
    return this.documents.find((doc) => doc.id === id) ?? null;
  }

  async delete(id: string): Promise<void> {
    const index = this.documents.findIndex((doc) => doc.id === id);

    if (index !== -1) {
      this.documents.splice(index, 1);
    }
  }
}
