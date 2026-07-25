import { KnowledgeDocument } from "../../src/domain/document/models/document";

export function createTestDocument(input: {
  id: string;
  title: string;
  content: string;
}): KnowledgeDocument {
  return {
    id: input.id,

    title: input.title,

    pieces: [
      {
        text: input.content,

        metadata: {
          source: "eval",
        },
      },
    ],

    metadata: {
      mimeType: "text/plain",

      source: "eval",

      language: "ru",
    },
  };
}
