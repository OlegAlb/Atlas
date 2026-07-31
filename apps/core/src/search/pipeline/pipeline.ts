import { SearchStep } from "./step";
import { SearchContext } from "./context";

export class SearchPipeline {
  constructor(private readonly steps: SearchStep[]) {}

  async execute(query: string) {
    let context: SearchContext = {
      query,

      queryTokens: [],

      results: [],

      trace: {
        query,
        steps: [],
      },
    };

    for (const step of this.steps) {
      context = await step.run(context);
    }

    return context;
  }
}
