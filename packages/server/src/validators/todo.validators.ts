import { z } from "zod";

export const createTodoSchema = z.object({
  title: z.string().trim().min(1, "title is required"),
  description: z.string().trim().nullable().optional(),
});

export const updateTodoSchema = z.object({
  title: z.string().trim().min(1, "title is required"),
  description: z.string().trim().nullable().optional(),
});

export type CreateTodoInput = z.infer<typeof createTodoSchema>;
export type UpdateTodoInput = z.infer<typeof updateTodoSchema>;
