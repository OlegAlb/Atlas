import { KnowledgeDocument, SourceDocument } from "../models/document";

export interface DocumentParser {
  supports(document: SourceDocument): boolean;

  parse(document: SourceDocument): Promise<KnowledgeDocument>;
}
