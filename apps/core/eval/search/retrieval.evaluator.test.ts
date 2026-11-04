import { describe, expect, it, vi } from "vitest";

import type { SearchEngine } from "../../src/search/search.engine";
import type { SearchCase } from "./models/search-case.model";
import { RetrievalEvaluator } from "./retrieval.evaluator";

function cases(count: number): SearchCase[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `case-${index}`,
    query: `query-${index}`,
    relevantDocuments: [`doc-${index}`],
  }));
}

describe("RetrievalEvaluator", () => {
  it("evaluates every case, not just the first one", async () => {
    const engine = {
      search: vi.fn(async () => ({ results: [] })),
    } as unknown as SearchEngine;

    const evaluator = new RetrievalEvaluator(engine);

    const results = await evaluator.evaluate(cases(5));

    expect(results).toHaveLength(5);
    expect(engine.search).toHaveBeenCalledTimes(5);
  });

  it("keeps the case id and query of each result", async () => {
    const engine = {
      search: vi.fn(async () => ({ results: [] })),
    } as unknown as SearchEngine;

    const results = await new RetrievalEvaluator(engine).evaluate(cases(3));

    expect(results.map((item) => item.caseId)).toEqual([
      "case-0",
      "case-1",
      "case-2",
    ]);
    expect(results.map((item) => item.query)).toEqual([
      "query-0",
      "query-1",
      "query-2",
    ]);
  });

  it("passes the case query to the search engine", async () => {
    const search = vi.fn(async () => ({ results: [] }));

    const evaluator = new RetrievalEvaluator({
      search,
    } as unknown as SearchEngine);

    await evaluator.evaluate(cases(2));

    expect(search).toHaveBeenNthCalledWith(1, "query-0");
    expect(search).toHaveBeenNthCalledWith(2, "query-1");
  });
});
