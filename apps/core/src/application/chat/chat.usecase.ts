import { ChatRequestDTO } from "../../api/chat/chat.dto";
import { ConversationMemory } from "../../infrastructure/conversation/conversation.memory";
import { LLMMessage, LLMProvider } from "../../providers/llm/providers/llm.provider";

import { KnowledgeService } from "../knowledge/knowledge.service";

export class ChatUseCase {
  constructor(
    private readonly llm: LLMProvider,

    private readonly memory: ConversationMemory,

    private readonly knowledge: KnowledgeService,
  ) {}

  async execute(dto: ChatRequestDTO) {
    const history = await this.memory.get(dto.conversationId);
    const context = await this.knowledge.search(dto.message);

    const knowledge = context.results
      .map((item) => item.chunk.text)
      .join("\n\n---\n\n");

    const messages: LLMMessage[] = [
      {
        role: "system",
        content: `
          Ты AI-помощник службы поддержки.

          Правила:

          1. Отвечай только используя базу знаний.
          2. Если информации недостаточно — скажи, что не знаешь.
          3. Не объединяй несколько документов, если они противоречат друг другу.
          4. Не придумывай данные.

          База знаний:

          ${knowledge}
          `,
      },

      ...history,

      {
        role: "user",
        content: dto.message,
      },
    ];

    const response = await this.llm.chat({
      messages,
    });

    await this.memory.append(
      dto.conversationId,

      [
        {
          role: "user",
          content: dto.message,
        },

        {
          role: "assistant",
          content: response.content,
        },
      ],
    );

    return {
      answer: response.content,
    };
  }
}
