import { SourceDocument } from "../../domain/document/models/document";
import { DocumentLoader } from "./document-loader";

export interface PlainTextInput {
  id?: string;
  title: string;
  text: string;
  source?: string;
}

export class PlainTextLoader implements DocumentLoader {
  async load(input: PlainTextInput): Promise<SourceDocument> {
    return {
      id: input.id ?? crypto.randomUUID(),
      title: input.title,
      mimeType: "text/plain",
      data: input.text,
      source: input.source,
    };
  }
}
