export type LLMRole = "system" | "user" | "assistant";

export interface LLMMessage {
  role: LLMRole;
  content: string;
}

export interface LLMRequest {
  messages: LLMMessage[];
}

export interface LLMResponse {
  content: string;
}

export interface LLMProvider {
  chat(request: LLMRequest): Promise<LLMResponse>;
}
