import { LLMMessage } from "../../providers/llm/providers/llm.provider";

export interface ConversationMemory {
  get(conversationId: string): Promise<LLMMessage[]>;

  append(conversationId: string, messages: LLMMessage[]): Promise<void>;
}
