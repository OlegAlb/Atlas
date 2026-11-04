import { describe, expect, it, vi } from "vitest";

import type { KnowledgeSearchResult } from "../../domain/search/models/knowledge-search-result";
import type { RerankingProvider } from "../../providers/reranking/providers/reranking.provider";
import { ProviderReranker } from "./provider.reranker";

function hit(id: string, score: number): KnowledgeSearchResult {
  return {
    document: {
      id: `doc-${id}`,
      title: id,
      pieces: [],
      metadata: { mimeType: "text/plain" },
    },
    chunk: {
      id,
      documentId: `doc-${id}`,
      order: 0,
      text: `text ${id}`,
      metadata: {},
    },
    score,
  };
}

function provider(results: { index: number; score: number }[]) {
  return {
    rerank: vi.fn(async () => ({ results })),
  } satisfies RerankingProvider;
}

describe("ProviderReranker", () => {
  it("does not call the provider when there is nothing to rerank", async () => {
    const fake = provider([]);

    const reranked = await new ProviderReranker(fake).rerank("query", [], 5);

    expect(reranked).toEqual([]);
    expect(fake.rerank).not.toHaveBeenCalled();
  });

  it("orders results by the indexes returned by the provider", async () => {
    const fake = provider([
      { index: 2, score: 0.9 },
      { index: 0, score: 0.5 },
      { index: 1, score: 0.1 },
    ]);

    const results = [hit("a", 0.3), hit("b", 0.2), hit("c", 0.1)];

    const reranked = await new ProviderReranker(fake).rerank("query", results, 3);

    expect(reranked.map((item) => item.chunk.id)).toEqual(["c", "a", "b"]);
  });

  it("sends the query, the limit and the chunk texts to the provider", async () => {
    const fake = provider([{ index: 0, score: 1 }]);

    await new ProviderReranker(fake).rerank("оплата заказа", [hit("a", 0.3)], 5);

    expect(fake.rerank).toHaveBeenCalledWith({
      query: "оплата заказа",
      limit: 5,
      documents: [{ id: "a", text: "text a" }],
    });
  });
});
