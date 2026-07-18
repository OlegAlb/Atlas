import { createServer } from "./bootstrap/createServer";
import { env } from "./config/env";

async function start() {
  const app = await createServer();

  const port = env.PORT;

  await app.listen({
    port,
    host: "0.0.0.0",
  });

  app.log.info(`Atlas API listening on http://localhost:${port}`);
}

start();
