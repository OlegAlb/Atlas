import { z } from "zod";

export const ChatRequestSchema = z.object({
  conversationId: z.string().min(1),
  message: z.string().min(1),
});

export const ChatResponseSchema = z.object({
  answer: z.string().min(1),
});
