import { FastifyInstance } from "fastify";
import { registerKnowledgeRoutes } from "./knowledge.routes";

import { KnowledgeCreateUseCase } from "../../application/knowledge/knowledge.create.usecase";
import { KnowledgeListUseCase } from "../../application/knowledge/knowledge.list.usecase";
import { KnowledgeController } from "./knowledge.controller";

export async function registerKnowledgeModule(
  app: FastifyInstance,
  createUseCase: KnowledgeCreateUseCase,
  listDocumentsUseCase: KnowledgeListUseCase,
) {
  const controller = new KnowledgeController(
    createUseCase,
    listDocumentsUseCase,
  );

  await registerKnowledgeRoutes(app, controller);
}
