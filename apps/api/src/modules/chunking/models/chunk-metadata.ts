import { ContentType } from "../content-type";

export interface ChunkMetadata {
  source?: string;
  page?: number;
  heading?: string;
  headingPath?: string[];
  contentType?: ContentType;
}
