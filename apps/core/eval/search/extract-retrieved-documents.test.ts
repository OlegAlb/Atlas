import { describe, expect, it } from "vitest";

import type { KnowledgeChunk } from "../../src/chunking/models/knowledge-chunk";
import type { KnowledgeDocument } from "../../src/domain/document/models/document";
import type { KnowledgeSearchResult } from "../../src/domain/search/models/knowledge-search-result";
import { extractRetrievedDocuments } from "./extract-retrieved-documents";

const document: KnowledgeDocument = {
  id: "doc",
  title: "Document",
  pieces: [],
  metadata: { mimeType: "text/plain" },
};

function hit(chunkId: string, documentId: string, score: number) {
  const chunk: KnowledgeChunk = {
    id: chunkId,
    documentId,
    order: 0,
    text: "text",
    metadata: {},
  };

  return {
    chunk,
    document: { ...document, id: documentId, title: documentId },
    score,
  } satisfies KnowledgeSearchResult;
}

describe("extractRetrievedDocuments", () => {
  it("collapses several chunks of the same document into one entry", () => {
    const documents = extractRetrievedDocuments([
      hit("chunk-1", "doc-a", 0.4),
      hit("chunk-2", "doc-a", 0.9),
      hit("chunk-3", "doc-b", 0.2),
    ]);

    expect(documents).toHaveLength(2);
    expect(documents.map((item) => item.id)).toEqual(["doc-a", "doc-b"]);
  });

  it("keeps the best score of a document", () => {
    const documents = extractRetrievedDocuments([
      hit("chunk-1", "doc-a", 0.4),
      hit("chunk-2", "doc-a", 0.9),
    ]);

    expect(documents[0].score).toBe(0.9);
  });

  it("returns an empty list when nothing was retrieved", () => {
    expect(extractRetrievedDocuments([])).toEqual([]);
  });
});
