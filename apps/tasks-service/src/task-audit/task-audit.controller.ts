import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TaskAuditService } from './task-audit.service';
import { CreateTaskAuditDto } from '@my-monorepo/shared-dtos';
import { UpdateTaskAuditDto } from '@my-monorepo/shared-dtos';

@Controller('task-audit')
export class TaskAuditController {
  constructor(private readonly taskAuditService: TaskAuditService) {}

  @Post()
  create(@Body() createTaskAuditDto: CreateTaskAuditDto) {
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
