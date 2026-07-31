import { env } from "../../config/env";
import { GroqProvider } from "./providers/groq.llm.provider";
import { LLMProvider } from "./providers/llm.provider";

type LLMProviderType = "groq";

export function createLLMProvider(
  type: LLMProviderType = env.LLM_PROVIDER,
): LLMProvider {
  switch (type) {
    case "groq":
      return new GroqProvider({
        apiKey: env.LLM_API_KEY,
        model: env.LLM_MODEL,
      });

    default:
      throw new Error(`Unsupported LLM provider: ${env.LLM_PROVIDER}`);
  }
}
