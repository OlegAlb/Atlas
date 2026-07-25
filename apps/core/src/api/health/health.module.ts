import { FastifyInstance } from "fastify";
import { HealthController } from "./health.controller";
import { registerHealthRoutes } from "./health.routes";
import { HealthUseCase } from "../../application/health/health.usecase";

export async function registerHealthModule(app: FastifyInstance) {
  const useCase = new HealthUseCase();

  const controller = new HealthController(useCase);

  await registerHealthRoutes(app, controller);
}
