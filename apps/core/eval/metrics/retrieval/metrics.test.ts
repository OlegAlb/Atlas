import { describe, expect, it } from "vitest";

import type { SearchResult } from "../../search/models/search-result.model";
import { reciprocalRank } from "./mrr";
import { ndcg } from "./ndcg";
import { recallAtK } from "./recall-at-k";

function result(relevant: string[], retrieved: string[]): SearchResult {
  return {
    caseId: "case",
    query: "query",
    relevantDocuments: relevant,
    retrievedDocuments: retrieved.map((id) => ({ id, title: id, score: 1 })),
  };
}

describe("recallAtK", () => {
  it("returns 1 when a relevant document is inside the top k", () => {
    expect(recallAtK(result(["b"], ["a", "b", "c"]), 5)).toBe(1);
  });

  it("returns 0 when the relevant document is outside the top k", () => {
    expect(recallAtK(result(["f"], ["a", "b", "c", "d", "e", "f"]), 5)).toBe(0);
  });

  it("returns 0 when nothing was retrieved", () => {
    expect(recallAtK(result(["a"], []), 5)).toBe(0);
  });

  it("returns 0 when a case has no relevant documents", () => {
    expect(recallAtK(result([], ["a"]), 5)).toBe(0);
  });
});

describe("reciprocalRank", () => {
  it("is 1 when the first result is relevant", () => {
    expect(reciprocalRank(result(["a"], ["a", "b"]))).toBe(1);
  });

  it("is 1/3 when the third result is the first relevant one", () => {
    expect(reciprocalRank(result(["c"], ["a", "b", "c"]))).toBeCloseTo(1 / 3);
  });

  it("is 0 when no result is relevant", () => {
    expect(reciprocalRank(result(["z"], ["a", "b"]))).toBe(0);
  });

  it("is 0 when nothing was retrieved", () => {
    expect(reciprocalRank(result(["a"], []))).toBe(0);
  });
});

describe("ndcg", () => {
  it("is 1 for a perfect ranking", () => {
    expect(ndcg(result(["a", "b"], ["a", "b"]), 5)).toBe(1);
  });

  it("penalises a relevant document pushed to the second position", () => {
    expect(ndcg(result(["a"], ["x", "a"]), 5)).toBeCloseTo(1 / Math.log2(3));
  });

  it("is 0 when no retrieved document is relevant", () => {
    expect(ndcg(result(["z"], ["a", "b"]), 5)).toBe(0);
  });

  it("is 0 when a case has no relevant documents (no ideal ranking)", () => {
    expect(ndcg(result([], ["a", "b"]), 5)).toBe(0);
  });

  it("is 0 for k = 0", () => {
    expect(ndcg(result(["a"], ["a"]), 0)).toBe(0);
  });

  it("does not fail when k is larger than the result list", () => {
    expect(ndcg(result(["a"], ["a"]), 100)).toBe(1);
  });
});
