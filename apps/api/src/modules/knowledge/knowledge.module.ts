import { FastifyInstance } from "fastify";
import { KnowledgeIngestionUseCase } from "./knowledge.ingestion.usecase";
import { registerKnowledgeRoutes } from "./knowledge.routes";

import { KnowledgeController } from "./knowledge.controller";
import { KnowledgeListUseCase } from "./knowledge.list.usecase";

export async function registerKnowledgeModule(
  app: FastifyInstance,
  ingestionUseCase: KnowledgeIngestionUseCase,
  listDocumentsUseCase: KnowledgeListUseCase,
) {
  const controller = new KnowledgeController(
    ingestionUseCase,
    listDocumentsUseCase,
  );

  await registerKnowledgeRoutes(app, controller);
}
