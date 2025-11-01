import { z } from "zod";

export const TaskPriority = z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]);
export const TaskStatus = z.enum(["TODO", "IN_PROGRESS", "REVIEW", "DONE"]);

export const createTaskSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  description: z.string().min(1, "Descrição é obrigatória"),
  deadline: z
    .string()
    .min(1, "Prazo é obrigatório")
    .refine(
      (val) => !isNaN(Date.parse(val)),
      "Prazo deve ser uma data válida (ex: 2026-01-01)"
    ),
  priority: TaskPriority,
  status: TaskStatus,
});

export type CreateTaskFormValues = z.infer<typeof createTaskSchema>;
