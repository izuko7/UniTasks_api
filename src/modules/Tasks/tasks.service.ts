import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service.js";
import { CreateTaskDto } from "./dto/create-task.dto.js";
import { ListTasksQueryDto } from "./dto/list-task.dto.js";
import { UpdateTaskDto } from "./dto/update-task.dto.js";

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

    findAll(userId: string, filters: ListTasksQueryDto) {
    const { search, ...rest } = filters;

    return this.prisma.task.findMany({
            where: {
                userId,
                ...rest,
                ...(search && {
                    title: { contains: search, mode: "insensitive" },
                }),
            },
            orderBy: { createdAt: "desc" },
        });
    }

    async stats(userId:string) {
        const [total, TODO, IN_PROGRESS, COMPLETED, overdue] = await Promise.all([
           this.prisma.task.count({
            where: {userId},
           }),

        //    Tâche en attente
           this.prisma.task.count({
            where: {
                userId,
                status: "TODO",
            },
           }),
        // Tâche en cours
           this.prisma.task.count({
            where: {
                userId,
                status: "IN_PROGRESS",
            },
           }),
        // Tâche terminée
           this.prisma.task.count({
            where: {
                userId,
                status: "COMPLETED",
            },
           }),
        // Tâche en retard
        this.prisma.task.count({
            where: {
                userId,
                dueDate: {
                    lt: new Date(),
                },
                status: {
                    not : "COMPLETED",
                },
            },
        }),
        ])
        return {total, TODO, IN_PROGRESS, COMPLETED, overdue}
    }

    async update(userId: string, id: number, dto: UpdateTaskDto){
        await this.findOne(userId, id);
        return this.prisma.task.update({
            where: {id},
            data: dto,
        });
    }

    async remove(userId:string, id: number) {
        await this.findOne(userId, id);
        await this.prisma.task.delete({
            where: {id},
        });
    }
}