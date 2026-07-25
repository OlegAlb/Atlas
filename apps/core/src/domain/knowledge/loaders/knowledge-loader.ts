import { KnowledgeDocument } from "../../document/models/document";

export interface KnowledgeLoader<TInput = unknown> {
  load(input: TInput): Promise<KnowledgeDocument>;
}
