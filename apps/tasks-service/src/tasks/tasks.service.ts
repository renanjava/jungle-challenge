/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from '@my-monorepo/shared-dtos';
import { UpdateTaskDto } from '@my-monorepo/shared-dtos';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private readonly tasksRepository: Repository<Task>,
  ) {}

  create(createTaskDto: CreateTaskDto) {
    try {
      return this.tasksRepository.save(createTaskDto);
    } catch (error) {
      throw new RpcException({
        statusCode: error.status || 500,
        message: error.message || 'Erro ao criar tarefa',
      });
    }
  }

  async findAll(page = 1, size = 10) {
    try {
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
    } catch (error) {
      throw new RpcException({
        statusCode: error.status || 500,
        message: error.message || 'Erro ao buscar tarefa',
      });
    }
  }

  async findById(id: string) {
    try {
      return await this.tasksRepository.findOneByOrFail({ id });
    } catch (error) {
      throw new RpcException({
        statusCode: error.status || 500,
        message: error.message || 'Erro ao buscar tarefa',
      });
    }
  }

  async update(id: string, updateTaskDto: UpdateTaskDto) {
    try {
      await this.findById(id);
      await this.tasksRepository.update(id, updateTaskDto);
      return await this.findById(id);
    } catch (error) {
      throw new RpcException({
        statusCode: error.status || 500,
        message: error.message || 'Erro ao atualizar tarefa',
      });
    }
  }

  async remove(id: string) {
    try {
      const task = await this.findById(id);
      await this.tasksRepository.delete(id);
      return task;
    } catch (error) {
      throw new RpcException({
        statusCode: error.status || 500,
        message: error.message || 'Erro ao deletar tarefa',
      });
    }
  }
}
