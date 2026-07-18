import { ContentType } from "../../chunking/content-type";

export interface TextPieceMetadata {
  heading?: string;
  headingPath?: string[];
  source?: string;
  page?: number;
  contentType?: ContentType;
  [key: string]: unknown;
}

export interface TextPiece {
  text: string;
  metadata: TextPieceMetadata;
}
