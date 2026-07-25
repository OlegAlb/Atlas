import { FastifyInstance } from "fastify";
import { HealthController } from "./health.controller";

export async function registerHealthRoutes(
  app: FastifyInstance,
  controller: HealthController,
) {
  app.get("/", controller.getHealth);
}
