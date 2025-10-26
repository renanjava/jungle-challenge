/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Controller, Get, Body, Patch, Param, Delete } from '@nestjs/common';
import { TaskAuditService } from './task-audit.service';
import { CreateTaskAuditDto } from '@my-monorepo/shared-dtos';
import { UpdateTaskAuditDto } from '@my-monorepo/shared-dtos';
import { RABBITMQ_CREATE_TASK_AUDIT } from '@my-monorepo/shared-config';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { LoggerService } from '@my-monorepo/shared-logger';

@Controller('task-audit')
export class TaskAuditController {
  constructor(
    private readonly taskAuditService: TaskAuditService,
    private readonly logger: LoggerService,
  ) {}

  @MessagePattern({ cmd: RABBITMQ_CREATE_TASK_AUDIT })
  create(@Payload() createTaskAuditDto: CreateTaskAuditDto) {
    this.logger.log("(POST) - Path '/' do TaskAuditController");
    return this.taskAuditService.create(createTaskAuditDto);
  }

  @Get()
  findAll() {
    return this.taskAuditService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.taskAuditService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTaskAuditDto: UpdateTaskAuditDto,
  ) {
    return this.taskAuditService.update(+id, updateTaskAuditDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.taskAuditService.remove(+id);
  }
}
