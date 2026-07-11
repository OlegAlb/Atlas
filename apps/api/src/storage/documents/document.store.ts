import { KnowledgeDocument } from "../../modules/knowledge/knowledge.types";

export interface DocumentStore {
  save(document: KnowledgeDocument): Promise<void>;

  list(): Promise<KnowledgeDocument[]>;

  getById(id: string): Promise<KnowledgeDocument | null>;

  delete(id: string): Promise<void>;
}
