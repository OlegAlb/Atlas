import { FastifyInstance } from "fastify";
import { KnowledgeController } from "./knowledge.controller";

export async function registerKnowledgeRoutes(
  app: FastifyInstance,
  controller: KnowledgeController,
) {
  app.post("/documents", controller.createDocument);

  app.get("/documents", controller.listDocuments);
}
