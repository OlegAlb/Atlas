import { KnowledgeDocument } from "../../modules/document/models/document";
import { DocumentStore } from "./documents.store";

export class InMemoryDocumentStore implements DocumentStore {
  private readonly documents: KnowledgeDocument[] = [];

  async save(document: KnowledgeDocument): Promise<KnowledgeDocument> {
    const stored = {
      ...document,
      id: crypto.randomUUID(),
    };

    this.documents.push(stored);

    return stored;
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
