import { TextPiece } from "./text-piece";

export interface SourceDocument {
  id: string;
  title: string;
  mimeType: string;
  data: Buffer | string;
  source?: string;
}

export interface KnowledgeDocument {
  id: string;
  title: string;
  pieces: TextPiece[];
  metadata: DocumentMetadata;
}

export interface DocumentMetadata {
  mimeType: string;
  source?: string;
  language?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
