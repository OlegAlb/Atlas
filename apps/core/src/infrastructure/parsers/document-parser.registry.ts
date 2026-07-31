import { SourceDocument } from "../../domain/document/models/document";
import { DocumentParser } from "./document-parser";

export class DocumentParserRegistry {
  constructor(private readonly parsers: DocumentParser[]) {}

  get(document: SourceDocument): DocumentParser {
    const parser = this.parsers.find((parser) => parser.supports(document));

    if (!parser) {
      throw new Error(`Parser for ${document.mimeType} not found`);
    }

    return parser;
  }
}
