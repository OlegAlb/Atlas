import { RetrievalContext } from "./context";

export interface RetrievalStep {
  run(context: RetrievalContext): Promise<RetrievalContext>;
}
