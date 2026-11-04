import "dotenv/config";

import { z } from "zod";

const EnvSchema = z.object({
  PORT: z.coerce.number().default(3000),

  LLM_PROVIDER: z.enum(["groq"]).default("groq"),
  LLM_API_KEY: z.string().default(""),
  LLM_MODEL: z.string().default("openai/gpt-oss-120b"),

  EMBEDDING_PROVIDER: z.enum(["jina", "noop"]).default("noop"),
  EMBEDDING_API_KEY: z.string().default(""),
  EMBEDDING_MODEL: z.string().default("jina-embeddings-v5-text-small"),

  RERANKING_PROVIDER: z.enum(["jina", "noop"]).default("noop"),
  RERANKING_API_KEY: z.string().default(""),
  RERANKING_MODEL: z.string().default("jina-reranker-v3"),
});

export const env = EnvSchema.parse(process.env);
