import "dotenv/config";

import { z } from "zod";

const EnvSchema = z.object({
  PORT: z.coerce.number().default(3000),

  GROQ_API_KEY: z.string(),
  GROQ_MODEL: z.string().default("openai/gpt-oss-120b"),
});

export const env = EnvSchema.parse(process.env);
