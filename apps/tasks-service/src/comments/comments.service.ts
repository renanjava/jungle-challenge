/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from '@my-monorepo/shared-dtos';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { Repository } from 'typeorm';
import { TasksService } from '../tasks/tasks.service';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentsRepository: Repository<Comment>,
    private readonly tasksService: TasksService,
  ) {}

  async create(taskId: string, createCommentDto: CreateCommentDto) {
    try {
      await this.tasksService.findById(taskId);
      const commentEntity = this.commentsRepository.create({
        task_id: taskId,
        ...createCommentDto,
      });
      return await this.commentsRepository.save(commentEntity);
    } catch (error) {
      throw new RpcException({
        statusCode: error.status || 500,
        message: error.message || 'Erro ao criar comentário para a tarefa',
      });
    }
  }

  async findAllByTaskId(page = 1, size = 10, taskId: string) {
    try {
      await this.tasksService.findById(taskId);
      const query = this.commentsRepository
        .createQueryBuilder('comments')
        .where({ task_id: taskId })
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
        message: error.message || 'Erro ao buscar comentários',
      });
    }
  }
}
