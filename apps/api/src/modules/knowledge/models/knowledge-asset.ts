import { KnowledgeMetadata } from "./knowledge-metadata";

export interface KnowledgeAsset {
  id: string;
  title: string;
  text: string;
  metadata: KnowledgeMetadata;
}
