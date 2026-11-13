import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service.js";
import { CreateTaskDto } from "./dto/create-task.dto.js";
import { ListTasksQueryDto } from "./dto/list-task.dto.js";
import { UpdateTaskDto } from "./dto/update-task.dto.js";
import { ne, th } from "zod/v4/locales";

@Injectable()
export class TasksService {
    constructor(private readonly prisma: PrismaService) {}

    // Créer une tâche 
    async create(userId: string, dto: CreateTaskDto) {
        return this.prisma.task.create({
            data: {...dto, userId}
        });
    }

    // Vérifier que la tâche existe et appartient au user connecté
    async findOne(userId: string, id: number) {
        const task = await this.prisma.task.findFirst({
            where: { id, userId},
        });
        if (!task) {
            throw new NotFoundException(`Tâche ${id} introuvable`);
        }
        return task;
    }

    
}