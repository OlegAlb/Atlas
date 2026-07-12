import "dotenv/config";

import { z } from "zod";

const EnvSchema = z.object({
  PORT: z.coerce.number().default(3000),

  LLM_PROVIDER: z.enum(["groq"]).default("groq"),
  LLM_API_KEY: z.string(),
  LLM_MODEL: z.string().default("openai/gpt-oss-120b"),

  EMBEDDING_PROVIDER: z.enum(["jina", "fake"]).default("fake"),
  EMBEDDING_API_KEY: z.string(),
  EMBEDDING_MODEL: z.string().default("jina-embeddings-v5-text-small"),
});

export const env = EnvSchema.parse(process.env);
