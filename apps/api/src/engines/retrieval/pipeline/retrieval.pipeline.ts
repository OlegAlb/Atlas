import { RetrievalStep } from "./retrieval-step";
import { RetrievalContext } from "./retrieval.context";

export class RetrievalPipeline {
  constructor(private readonly steps: RetrievalStep[]) {}

  async execute(query: string) {
    let context: RetrievalContext = {
      query,
      keywordResults: [],
      finalResults: [],
    };

    for (const step of this.steps) {
      context = await step.run(context);
    }

    return context.finalResults;
  }
}
