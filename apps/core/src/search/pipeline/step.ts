import { SearchContext } from "./context";

export interface SearchStep {
  run(context: SearchContext): Promise<SearchContext>;
}
