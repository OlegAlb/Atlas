import z from "zod";
import { ChatRequestSchema, ChatResponseSchema } from "./chat.schema";

export type ChatRequestDTO = z.infer<typeof ChatRequestSchema>;

export type ChatResponseDTO = z.infer<typeof ChatResponseSchema>;
