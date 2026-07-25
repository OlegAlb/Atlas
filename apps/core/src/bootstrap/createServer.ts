import Fastify from "fastify";
import { registerPlugins } from "./registerPlugins";
import { registerRoutes } from "./registerRoutes";
import { createContainer } from "./createContainer";

export async function createServer() {
  const app = Fastify({
    logger: true,
  });

  const container = createContainer();
  
  await registerPlugins(app);
  await registerRoutes(app, container);

  return app;
}
