import { KnowledgeDocument } from "../documents/models/document";

export interface KnowledgeLoader<TInput = unknown> {
  load(input: TInput): Promise<KnowledgeDocument>;
}
