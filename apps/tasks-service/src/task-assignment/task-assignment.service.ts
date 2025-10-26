import { Injectable } from '@nestjs/common';
import { CreateTaskAssignmentDto } from '@my-monorepo/shared-dtos';
import { UpdateTaskAssignmentDto } from '@my-monorepo/shared-dtos';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskAssignment } from './entities/task-assignment.entity';
import { Repository } from 'typeorm';
import { TasksService } from '../tasks/tasks.service';

@Injectable()
export class TaskAssignmentService {
  constructor(
    @InjectRepository(TaskAssignment)
    private taskAssignmentRepository: Repository<TaskAssignment>,
    private readonly tasksService: TasksService,
  ) {}

  async create(dto: CreateTaskAssignmentDto): Promise<TaskAssignment> {
    await this.tasksService.findById(dto.task_id);
    const taskAssignment = this.taskAssignmentRepository.create(dto);
    return this.taskAssignmentRepository.save(taskAssignment);
  }

  findAll() {
    return `This action returns all taskAssignment`;
  }

  findOne(id: number) {
    return `This action returns a #${id} taskAssignment`;
  }

  update(id: number, updateTaskAssignmentDto: UpdateTaskAssignmentDto) {
    return `This action updates a #${id} taskAssignment`;
  }

  remove(id: number) {
    return `This action removes a #${id} taskAssignment`;
  }
}
