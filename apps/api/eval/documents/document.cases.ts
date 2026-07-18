import path from "node:path";

export interface DocumentEvalCase {
  name: string;

  fixture: string;

  input: {
    title: string;
  };

  expected: {
    mimeType: string;

    contains?: string[];

    chunks?: {
      min: number;
      max?: number;
    };
  };
}

export const documentCases: DocumentEvalCase[] = [
  {
    name: "plain text refund policy",

    fixture: path.join(__dirname, "../fixtures/simple.txt"),

    input: {
      title: "Политика возврата",
    },

    expected: {
      mimeType: "text/plain",

      contains: ["14 дней", "сохранена упаковка"],
    },
  },
  {
    name: "long document chunking",

    fixture: path.join(__dirname, "../fixtures/long.txt"),

    input: {
      title: "Политика возврата товаров",
    },

    expected: {
      mimeType: "text/plain",

      contains: ["Раздел 1", "Возврат денежных средств"],

      chunks: {
        min: 3,
        max: 20,
      },
    },
  },
];
