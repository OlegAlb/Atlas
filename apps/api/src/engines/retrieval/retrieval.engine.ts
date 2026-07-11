import { RetrievalPipeline } from "./pipeline/retrieval.pipeline";

export class RetrievalEngine {
  constructor(private readonly pipeline: RetrievalPipeline) {}

  retrieve(query: string) {
    return this.pipeline.execute(query);
  }
}
