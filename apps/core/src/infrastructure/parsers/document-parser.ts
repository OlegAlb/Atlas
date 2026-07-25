import {
  KnowledgeDocument,
  SourceDocument,
} from "../../domain/document/models/document";

export interface DocumentParser {
  supports(document: SourceDocument): boolean;

  parse(document: SourceDocument): Promise<KnowledgeDocument>;
}
