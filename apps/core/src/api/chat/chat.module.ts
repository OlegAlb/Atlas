import { ChatController } from "./chat.controller";
import { registerChatRoutes } from "./chat.routes";
import { ChatUseCase } from "../../application/chat/chat.usecase";

import { FastifyInstance } from "fastify";

export async function registerChatModule(
  app: FastifyInstance,
  useCase: ChatUseCase,
) {
  const controller = new ChatController(useCase);

  await registerChatRoutes(app, controller);
}
