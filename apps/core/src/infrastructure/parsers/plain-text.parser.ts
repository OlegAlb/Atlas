import { ContentType } from "../../chunking";
import {
  KnowledgeDocument,
  SourceDocument,
} from "../../domain/document/models/document";
import { DocumentParser } from "./document-parser";

export class PlainTextParser implements DocumentParser {
  supports(document: SourceDocument) {
    return document.mimeType == "text/plain";
  }

  async parse(source: SourceDocument): Promise<KnowledgeDocument> {
    return {
      id: source.id,
      title: source.title,
      pieces: [
        {
          text:
            typeof source.data === "string"
              ? source.data
              : source.data.toString("utf8"),

          metadata: {
            source: source.source,
            contentType: ContentType.TEXT,
          },
        },
      ],

      metadata: {
        mimeType: source.mimeType,
        source: source.source,
      },
    };
  }
}
