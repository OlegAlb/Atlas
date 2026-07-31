import { normalizeText } from "./normalize";
import { expandQuery } from "./synonym.expander";

export class QueryProcessor {
  process(query: string): string[] {
    return expandQuery(normalizeText(query));
  }
}
