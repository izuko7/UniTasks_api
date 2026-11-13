import { createZodDto } from "nestjs-zod";
import { createTaskSchema } from "./create-task.dto.js";


export class UpdateTaskDto extends createZodDto(
    createTaskSchema
    .partial()
    .refine((x) => Object.keys(x).length > 0, {
        message: `Au moins un champ à modifier`,
    })
) {}