import { SourceDocument } from "../../domain/document/models/document";
import { PlainTextInput } from "./plain-text.loader";

export interface DocumentLoader {
  load(input: PlainTextInput): Promise<SourceDocument>;
}
