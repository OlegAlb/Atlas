import { KnowledgeDocument } from "../../document/models/document";
import { KnowledgeChunk } from "../../knowledge/models/knowledge-chunk";

export interface Chunker {
  chunk(asset: KnowledgeDocument): KnowledgeChunk[];
}
