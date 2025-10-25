/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Controller, Param, Delete } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from '@my-monorepo/shared-dtos';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { LoggerService } from '@my-monorepo/shared-logger';

@Controller('tasks')
export class TasksController {
  constructor(
    private readonly tasksService: TasksService,
    private readonly logger: LoggerService,
  ) {}

  @MessagePattern({ cmd: 'task.created' })
  async create(@Payload() createTaskDto: CreateTaskDto) {
    this.logger.log("(POST) - Path '/' do TasksController");
    try {
      return await this.tasksService.create(createTaskDto);
    } catch (error) {
      throw new RpcException({
        statusCode: error.status || 500,
        message: error.message || 'Erro ao criar tarefa',
      });
    }
  }

  @MessagePattern({ cmd: 'get-all-task' })
  async findAll(@Payload() { page, size }: Record<string, any>) {
    this.logger.log("(GET) - Path '/tasks' do TasksController");
    try {
      return await this.tasksService.findAll(page, size);
    } catch (error) {
      throw new RpcException({
        statusCode: error.status || 500,
        message: error.message || 'Erro ao buscar tarefa',
      });
    }
  }

  @MessagePattern({ cmd: 'get-task-id' })
  async findById(@Payload() id: string) {
    this.logger.log("(GET) - Path '/tasks/:id' do TasksController");
    try {
      return await this.tasksService.findById(id);
    } catch (error) {
      throw new RpcException({
        statusCode: error.status || 500,
        message: error.message || 'Erro ao buscar tarefa',
      });
    }
  }

  @MessagePattern({ cmd: 'task.updated' })
  async update(@Payload() { id, updateTaskDto }: Record<string, any>) {
    this.logger.log("(PUT) - Path '/tasks/:id' do TasksController");
    try {
      return await this.tasksService.update(id, updateTaskDto);
    } catch (error) {
      throw new RpcException({
        statusCode: error.status || 500,
        message: error.message || 'Erro ao atualizar tarefa',
      });
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tasksService.remove(+id);
  }
}
