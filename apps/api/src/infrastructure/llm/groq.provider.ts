import axios from "axios";

import { LLMProvider, LLMRequest, LLMResponse } from "./llm.provider";

export class GroqProvider implements LLMProvider {
  constructor(
    private readonly config: {
      apiKey: string;
      model: string;
    },
  ) {}

  async chat(request: LLMRequest): Promise<LLMResponse> {
    try {
      const response = await axios.post(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          model: this.config.model,
          messages: request.messages,
          temperature: 0.2,
        },
        {
          headers: {
            Authorization: `Bearer ${this.config.apiKey}`,
            "Content-Type": "application/json",
          },
        },
      );

      return {
        content: response.data.choices[0].message.content,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log("GROQ STATUS:", error.response?.status);
        console.log("GROQ RESPONSE:", error.response?.data);
      }

      throw error;
    }
  }
}
