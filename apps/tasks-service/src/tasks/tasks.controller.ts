/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Controller } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto, UpdateTaskDto } from '@my-monorepo/shared-dtos';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { LoggerService } from '@my-monorepo/shared-logger';
import {
  RABBITMQ_GET_ALL_TASK,
  RABBITMQ_GET_TASK_ID,
  RABBITMQ_TASK_CREATED,
  RABBITMQ_TASK_DELETED,
  RABBITMQ_TASK_UPDATED,
} from '@my-monorepo/shared-config';

@Controller('tasks')
export class TasksController {
  constructor(
    private readonly tasksService: TasksService,
    private readonly logger: LoggerService,
  ) {}

  @MessagePattern({ cmd: RABBITMQ_TASK_CREATED })
  async create(@Payload() createTaskDto: CreateTaskDto) {
    this.logger.log("(POST) - Path '/' do TasksController");
    return await this.tasksService.create(createTaskDto);
  }

  @MessagePattern({ cmd: RABBITMQ_GET_ALL_TASK })
  async findAll(@Payload() payload: { page: number; size: number }) {
    this.logger.log("(GET) - Path '/tasks?page=&size=' do TasksController");
    return await this.tasksService.findAll(payload.page, payload.size);
  }

  @MessagePattern({ cmd: RABBITMQ_GET_TASK_ID })
  async findById(@Payload() id: string) {
    this.logger.log("(GET) - Path '/tasks/:id' do TasksController");
    return await this.tasksService.findById(id);
  }

  @MessagePattern({ cmd: RABBITMQ_TASK_UPDATED })
  async update(
    @Payload() payload: { id: string; updateTaskDto: UpdateTaskDto },
  ) {
    this.logger.log("(PUT) - Path '/tasks/:id' do TasksController");
    return await this.tasksService.update(payload.id, payload.updateTaskDto);
  }

  @MessagePattern({ cmd: RABBITMQ_TASK_DELETED })
  async remove(@Payload() id: string) {
    this.logger.log("(DELETE) - Path '/tasks/:id' do TasksController");
    return await this.tasksService.remove(id);
  }
}
