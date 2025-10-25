/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Controller, Get, Body, Patch, Param, Delete } from '@nestjs/common';
import { TaskAssignmentService } from './task-assignment.service';
import { CreateTaskAssignmentDto } from '@my-monorepo/shared-dtos';
import { UpdateTaskAssignmentDto } from '@my-monorepo/shared-dtos';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { LoggerService } from '@my-monorepo/shared-logger';

@Controller('task-assignment')
export class TaskAssignmentController {
  constructor(
    private readonly taskAssignmentService: TaskAssignmentService,
    private readonly logger: LoggerService,
  ) {}

  @MessagePattern({ cmd: 'task-assignment.created' })
  async create(@Payload() createTaskAssignmentDto: CreateTaskAssignmentDto) {
    this.logger.log("(POST) - Path '/' do TaskAssignmentController");
    try {
      return await this.taskAssignmentService.create(createTaskAssignmentDto);
    } catch (error) {
      throw new RpcException({
        statusCode: error.status || 500,
        message: error.message || 'Erro ao vincular usuário em tarefa',
      });
    }
  }

  @Get()
  findAll() {
    return this.taskAssignmentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.taskAssignmentService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTaskAssignmentDto: UpdateTaskAssignmentDto,
  ) {
    return this.taskAssignmentService.update(+id, updateTaskAssignmentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.taskAssignmentService.remove(+id);
  }
}
