import { FastifyInstance } from "fastify";

import { AppContainer } from "./createContainer";
import { registerHealthModule } from "../api/health";
import { registerChatModule } from "../api/chat";
import { registerKnowledgeModule } from "../api/knowledge";

export async function registerRoutes(
  app: FastifyInstance,
  container: AppContainer,
) {
  await app.register(
    async (app) => {
      await registerHealthModule(app);
    },
    {
      prefix: "/health",
    },
  );

  await app.register(
    async (app) => {
      await registerChatModule(app, container.chatUseCase);
    },
    {
      prefix: "/chat",
    },
  );

  await app.register(
    async (app) => {
      await registerKnowledgeModule(
        app,
        container.knowledgeCreateUseCase,
        container.knowledgeListUseCase,
      );
    },
    {
      prefix: "/knowledge",
    },
  );
}
