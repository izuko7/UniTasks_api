import { createZodDto } from "nestjs-zod";
import { z } from 'zod';


export const taskSatusSchema = z.enum(["TODO", "IN_PROGRESS", "COMPLETED"]);
export const prioritySchema = z.enum(["LOW", "MEDIUM", "HIGH"]);

export const createTaskSchema = z.object({
    title: z.string().trim().min(1, "Titre requis").max(255),
    description: z.string().trim().min(1, "Description requise"),
    priority: prioritySchema,
    status: taskSatusSchema.optional(),
    dueDate: z.coerce.date({ error: "Date invalide" }),
});


export class CreateTaskDto extends createZodDto(createTaskSchema) {}