import { describe, expect, it } from "vitest";

import type { KnowledgeChunk } from "../../../chunking/models/knowledge-chunk";
import { BM25Scorer } from "./bm25.scorer";
import { tokenize } from "./bm25.utils";
import { InMemoryBM25Indexer } from "./in-memory-bm25.indexer";

function chunk(id: string, text: string): KnowledgeChunk {
  return {
    id,
    documentId: `doc-${id}`,
    order: 0,
    text,
    metadata: {},
  };
}

const a = chunk("a", "apple apple banana");
const b = chunk("b", "banana cherry");
const c = chunk("c", "date");

describe("tokenize", () => {
  it("lowercases, strips punctuation and drops stop words", () => {
    expect(tokenize("Оплата заказа — картой и наличными!")).toEqual([
      "оплата",
      "заказа",
      "картой",
      "наличными",
    ]);
  });
});

describe("InMemoryBM25Indexer", () => {
  it("computes document frequency and average length over incremental adds", () => {
    const indexer = new InMemoryBM25Indexer();

    indexer.add([a]);
    indexer.add([b]);
    indexer.add([c]);

    const index = indexer.getIndex();

    expect(index.documents).toHaveLength(3);
    expect(index.documentFrequency.get("banana")).toBe(2);
    expect(index.documentFrequency.get("apple")).toBe(1);
    expect(index.averageDocumentLength).toBeCloseTo(2);
  });

  it("updates statistics again after new chunks are added", () => {
    const indexer = new InMemoryBM25Indexer();

    indexer.add([a]);

    expect(indexer.getIndex().documents).toHaveLength(1);

    indexer.add([b]);

    expect(indexer.getIndex().documents).toHaveLength(2);
    expect(indexer.getIndex().documentFrequency.get("banana")).toBe(2);
  });

  it("replaces the index on build", () => {
    const indexer = new InMemoryBM25Indexer();

    indexer.add([c]);
    indexer.build([a, b]);

    const index = indexer.getIndex();

    expect(index.documents).toHaveLength(2);
    expect(index.documentFrequency.get("date")).toBeUndefined();
  });
});

describe("BM25Scorer", () => {
  const indexer = new InMemoryBM25Indexer();

  indexer.build([a, b, c]);

  const index = indexer.getIndex();
  const scorer = new BM25Scorer();

  it("prefers the shorter document for the same term frequency", () => {
    const scoreA = scorer.score(["banana"], index.documents[0], index);
    const scoreB = scorer.score(["banana"], index.documents[1], index);

    expect(scoreB).toBeGreaterThan(scoreA);
  });

  it("scores a document without the term as zero", () => {
    expect(scorer.score(["apple"], index.documents[1], index)).toBe(0);
  });

  it("scores an unknown term as zero", () => {
    expect(scorer.score(["zebra"], index.documents[0], index)).toBe(0);
  });

  it("grows with term frequency", () => {
    const once = chunk("once", "banana cherry");
    const twice = chunk("twice", "banana banana cherry");

    const local = new InMemoryBM25Indexer();

    local.build([once, twice]);

    const localIndex = local.getIndex();

    const scoreOnce = scorer.score(["banana"], localIndex.documents[0], localIndex);
    const scoreTwice = scorer.score(["banana"], localIndex.documents[1], localIndex);

    expect(scoreTwice).toBeGreaterThan(scoreOnce);
  });
});
