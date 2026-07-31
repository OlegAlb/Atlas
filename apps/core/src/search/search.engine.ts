import { SearchPipeline } from "./pipeline/pipeline";

export class SearchEngine {
  constructor(private readonly pipeline: SearchPipeline) {}

  async search(query: string) {
    return this.pipeline.execute(query);
  }
}
