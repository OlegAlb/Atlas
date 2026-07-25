import { KnowledgeDocument } from "../../domain/document/models/document";
import { RawChunk } from "../models/raw-chunk";

export interface Chunker {
  chunk(asset: KnowledgeDocument): RawChunk[];
}
