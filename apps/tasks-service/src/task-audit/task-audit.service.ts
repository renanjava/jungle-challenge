import { Injectable } from '@nestjs/common';
import { CreateTaskAuditDto } from '@my-monorepo/shared-dtos';
import { UpdateTaskAuditDto } from '@my-monorepo/shared-dtos';

@Injectable()
export class TaskAuditService {
  create(createTaskAuditDto: CreateTaskAuditDto) {
    return 'This action adds a new taskAudit';
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
