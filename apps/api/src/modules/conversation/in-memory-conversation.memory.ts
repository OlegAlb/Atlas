import { ConversationMemory } from "./conversation.memory";

import { LLMMessage } from "../../infrastructure/llm/llm.provider";

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
