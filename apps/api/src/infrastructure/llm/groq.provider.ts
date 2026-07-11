import axios from "axios";

import { LLMProvider, LLMRequest, LLMResponse } from "./llm.provider";
import { env } from "../../config/env";

export class GroqProvider implements LLMProvider {
  async chat(request: LLMRequest): Promise<LLMResponse> {
    // const response = await axios.post(
    //   "https://api.groq.com/openai/v1/chat/completions",
    //   {
    //     model: "llama3-70b-8192",

    //     messages: request.messages,

    //     temperature: 0.2,
    //   },
    //   {
    //     headers: {
    //       Authorization: `Bearer ${env.GROQ_API_KEY}`,
    //     },
    //   },
    // );

    // return {
    //   content: response.data.choices[0].message.content,
    // };
    try {
      const response = await axios.post(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          model: env.GROQ_MODEL,
          messages: request.messages,
          temperature: 0.2,
        },
        {
          headers: {
            Authorization: `Bearer ${env.GROQ_API_KEY}`,
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
