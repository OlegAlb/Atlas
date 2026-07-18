import { KnowledgeDocument } from "../../modules/document/models/document";

export interface DocumentStore {
  save(document: KnowledgeDocument): Promise<KnowledgeDocument>;

  list(): Promise<KnowledgeDocument[]>;

  getById(id: string): Promise<KnowledgeDocument | null>;

  delete(id: string): Promise<void>;
}
