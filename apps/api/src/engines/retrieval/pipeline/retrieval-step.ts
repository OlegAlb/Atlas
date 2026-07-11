import { RetrievalContext } from "./retrieval.context";

export interface RetrievalStep {
  run(context: RetrievalContext): Promise<RetrievalContext>;
}
