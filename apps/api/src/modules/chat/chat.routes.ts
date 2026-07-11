import { FastifyInstance } from "fastify";
import { ChatController } from "./chat.controller";
import { ChatRequestSchema } from "./chat.schema";

export async function registerChatRoutes(
  app: FastifyInstance,
  controller: ChatController,
) {
  app.post("/", async (req, reply) => {
    const parsed = ChatRequestSchema.parse(req.body);

    const result = await controller.chat(parsed);

    return reply.send(result);
  });
}
