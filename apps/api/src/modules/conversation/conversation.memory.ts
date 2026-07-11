import { LLMMessage } from "../../infrastructure/llm/llm.provider";

export interface ConversationMemory {
  get(conversationId: string): Promise<LLMMessage[]>;

  append(conversationId: string, messages: LLMMessage[]): Promise<void>;
}
