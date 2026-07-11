import { RetrievalStep } from "./step";
import { RetrievalContext } from "./context";

export class RetrievalPipeline {
  constructor(private readonly steps: RetrievalStep[]) {}

  async execute(query: string) {
    let context: RetrievalContext = {
      query,

      transformedQuery: query,

      queryTokens: [],

      keywordResults: [],

      denseResults: [],

      finalResults: [],
    };

    for (const step of this.steps) {
      context = await step.run(context);
    }

    return context.finalResults;
  }
}
