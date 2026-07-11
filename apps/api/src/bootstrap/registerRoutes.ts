import { FastifyInstance } from "fastify";

import { registerChatModule } from "../modules/chat";
import { registerHealthModule } from "../modules/health";
import { registerKnowledgeModule } from "../modules/knowledge";
import { AppContainer } from "./createContainer";

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
        container.knowledgeIngestionUseCase,
        container.knowledgeListUseCase,
      );
    },
    {
      prefix: "/knowledge",
    },
  );
}
