/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { CreateTaskAuditDto } from '@my-monorepo/shared-dtos';
import { UpdateTaskAuditDto } from '@my-monorepo/shared-dtos';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskAudit } from './entities/task-audit.entity';
import { Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class TaskAuditService {
  constructor(
    @InjectRepository(TaskAudit)
    private readonly taskAuditRepository: Repository<TaskAudit>,
  ) {}

  create(createTaskAuditDto: CreateTaskAuditDto) {
    try {
      return this.taskAuditRepository.save(createTaskAuditDto);
    } catch (error) {
      throw new RpcException({
        statusCode: error.status || 500,
        message: error.message || 'Erro ao criar log de tarefa',
      });
    }
  }

  findAll() {
    return `This action returns all taskAudit`;
  }

  findOne(id: number) {
    return `This action returns a #${id} taskAudit`;
  }

  update(id: number, updateTaskAuditDto: UpdateTaskAuditDto) {
    return `This action updates a #${id} taskAudit`;
  }

  remove(id: number) {
    return `This action removes a #${id} taskAudit`;
  }
}
