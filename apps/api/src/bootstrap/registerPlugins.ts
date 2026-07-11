import { FastifyInstance } from "fastify";
import cors from "@fastify/cors";

export async function registerPlugins(app: FastifyInstance) {
  await app.register(cors);
}
