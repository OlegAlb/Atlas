import { LLMMessage } from "../../providers/llm/providers/llm.provider";
import { ConversationMemory } from "./conversation.memory";

export class InMemoryConversationMemory implements ConversationMemory {
  private conversations = new Map<string, LLMMessage[]>();

  async get(conversationId: string) {
    return this.conversations.get(conversationId) ?? [];
  }

  async append(conversationId: string, messages: LLMMessage[]) {
    const history = await this.get(conversationId);

    this.conversations.set(conversationId, [...history, ...messages]);
  }
}
