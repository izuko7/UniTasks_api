import { createZodDto } from "nestjs-zod";
import { z } from 'zod';
import { prioritySchema, taskSatusSchema } from "./create-task.dto.js";


export class ListTasksQueryDto extends createZodDto(
    z.object({
        status: taskSatusSchema.optional(),
        priority: prioritySchema.optional(),
        search: z.string().trim().optional(),
    })
) {}