import { describe, expect, it } from "vitest";

import type { KnowledgeDocument } from "../../domain/document/models/document";
import { MetadataMerger } from "../metadata/metadata-merger";
import { CharacterTokenizer } from "../tokenizer/character.tokenizer";
import { RecursiveChunker } from "./recursive.chunker";

const WORDS = [
  "aaa",
  "bbb",
  "ccc",
  "ddd",
  "eee",
  "fff",
  "ggg",
  "hhh",
  "iii",
  "jjj",
];

function document(text: string): KnowledgeDocument {
  return {
    id: "doc",
    title: "Document",
    pieces: [{ text, metadata: {} }],
    metadata: { mimeType: "text/plain" },
  };
}

function chunker(maxSize: number, overlap: number) {
  return new RecursiveChunker(
    new CharacterTokenizer(),
    new MetadataMerger(),
    maxSize,
    overlap,
  );
}

describe("RecursiveChunker", () => {
  it("returns a single chunk when the document fits", () => {
    const chunks = chunker(100, 10).chunk(document("короткий текст"));

    expect(chunks).toHaveLength(1);
    expect(chunks[0].text).toBe("короткий текст");
  });

  it("keeps every word of the document", () => {
    const chunks = chunker(20, 8).chunk(document(WORDS.join(" ")));
    const joined = chunks.map((chunk) => chunk.text).join(" ");

    for (const word of WORDS) {
      expect(joined).toContain(word);
    }
  });

  it("splits a long document and keeps the original boundaries", () => {
    const chunks = chunker(20, 8).chunk(document(WORDS.join(" ")));

    expect(chunks.length).toBeGreaterThan(1);
    expect(chunks[0].text.startsWith("aaa")).toBe(true);
    expect(chunks[chunks.length - 1].text.endsWith("jjj")).toBe(true);
  });

  it("numbers chunks sequentially", () => {
    const chunks = chunker(20, 8).chunk(document(WORDS.join(" ")));

    expect(chunks.map((chunk) => chunk.order)).toEqual(
      chunks.map((_, index) => index),
    );
  });

  it("repeats the tail of the previous chunk when overlap is enabled", () => {
    const chunks = chunker(20, 8).chunk(document(WORDS.join(" ")));

    expect(chunks[1].text.startsWith("ddd")).toBe(true);
    expect(chunks[0].text.endsWith("fff")).toBe(true);
  });

  it("does not add overlap when it is disabled", () => {
    const chunks = chunker(20, 0).chunk(document(WORDS.join(" ")));

    expect(chunks[1].text.startsWith("ggg")).toBe(true);
  });

  it("produces no empty chunks", () => {
    const chunks = chunker(20, 8).chunk(
      document(`  ${WORDS.join("   ")}  `),
    );

    for (const chunk of chunks) {
      expect(chunk.text.trim().length).toBeGreaterThan(0);
    }
  });
});
