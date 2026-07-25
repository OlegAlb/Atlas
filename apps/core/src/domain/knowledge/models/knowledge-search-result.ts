import { KnowledgeChunk } from "../../../chunking/models/knowledge-chunk";
import { KnowledgeDocument } from "../../document/models/document";

export interface KnowledgeSearchResult {
  document: KnowledgeDocument;
  chunk: KnowledgeChunk;
  score: number;

  source?: "keyword" | "dense" | "bm25";
}
