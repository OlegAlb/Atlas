import { env } from "../../config/env";
import { GroqProvider } from "./groq.provider";
import { LLMProvider } from "./llm.provider";

export function createLLMProvider(): LLMProvider {
  switch (env.LLM_PROVIDER) {
    case "groq":
      return new GroqProvider({
        apiKey: env.LLM_API_KEY,
        model: env.LLM_MODEL,
      });

    default:
      throw new Error(`Unsupported LLM provider: ${env.LLM_PROVIDER}`);
  }
}
