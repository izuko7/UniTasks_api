import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	ParseIntPipe,
	Patch,
	Post,
	Query,
    UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Session, type UserSession } from "@thallesp/nestjs-better-auth";
import { CreateTaskDto } from "./dto/create-task.dto.js";
import { ListTasksQueryDto } from "./dto/list-task.dto.js";
import { UpdateTaskDto } from "./dto/update-task.dto.js";
import { TasksService } from "./tasks.service.js";
import { SessionGuard } from "../../common/guards/session.guard.js";

@ApiTags("tasks")
@ApiBearerAuth()
@UseGuards(SessionGuard)
@Controller("tasks")
export class TasksController {
	constructor(private readonly tasksService: TasksService) {}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	create(@Session() session: UserSession, @Body() dto: CreateTaskDto) {
		return this.tasksService.create(session.user.id, dto);
	}

	@Get()
	@HttpCode(HttpStatus.OK)
	findAll(@Session() session: UserSession, @Query() query: ListTasksQueryDto) {
		return this.tasksService.findAll(session.user.id, query);
	}

	@Get("stats")
	@HttpCode(HttpStatus.OK)
	stats(@Session() session: UserSession) {
		return this.tasksService.stats(session.user.id);
	}

	@Get(":id")
	@HttpCode(HttpStatus.OK)
	findOne(
		@Session() session: UserSession,
		@Param("id", ParseIntPipe) id: number,
	) {
		return this.tasksService.findOne(session.user.id, id);
	}

	@Patch(":id")
	@HttpCode(HttpStatus.OK)
	update(
		@Session() session: UserSession,
		@Param("id", ParseIntPipe) id: number,
		@Body() dto: UpdateTaskDto,
	) {
		return this.tasksService.update(session.user.id, id, dto);
	}

	@Delete(":id")
	@HttpCode(HttpStatus.NO_CONTENT)
	remove(
		@Session() session: UserSession,
		@Param("id", ParseIntPipe) id: number,
	) {
		return this.tasksService.remove(session.user.id, id);
	}
}