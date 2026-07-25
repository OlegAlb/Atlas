import { RetrievalPipeline } from "./pipeline/pipeline";

export class RetrievalEngine {
  constructor(private readonly pipeline: RetrievalPipeline) {}

  retrieve(query: string) {
    return this.pipeline.execute(query);
  }
}
