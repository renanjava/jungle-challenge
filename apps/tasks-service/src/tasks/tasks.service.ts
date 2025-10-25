import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from '@my-monorepo/shared-dtos';
import { UpdateTaskDto } from '@my-monorepo/shared-dtos';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private readonly tasksRepository: Repository<Task>,
  ) {}

  create(createTaskDto: CreateTaskDto) {
    return this.tasksRepository.save(createTaskDto);
  }

  async findAll(page = 1, size = 10) {
    const query = this.tasksRepository
      .createQueryBuilder('tasks')
      .skip((page - 1) * size)
      .take(size);

    const [data, total] = await query.getManyAndCount();

    return {
      data,
      total,
      page,
      size,
      totalPages: Math.ceil(total / size),
    };
  }

  findById(id: string) {
    return this.tasksRepository.findOneByOrFail({ id });
  }

  update(id: number, updateTaskDto: UpdateTaskDto) {
    return `This action updates a #${id} task`;
  }

  remove(id: number) {
    return `This action removes a #${id} task`;
  }
}
