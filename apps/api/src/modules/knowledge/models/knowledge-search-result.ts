import { KnowledgeDocument } from "../../document/models/document";
import { KnowledgeChunk } from "./knowledge-chunk";

export interface KnowledgeSearchResult {
  document: KnowledgeDocument;
  chunk: KnowledgeChunk;
  score: number;

  source?: "keyword" | "dense" | "bm25";
}
