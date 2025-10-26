import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from '@my-monorepo/shared-dtos';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentsRepository: Repository<Comment>,
  ) {}

  async create(taskId: string, createCommentDto: CreateCommentDto) {
    const commentEntity = this.commentsRepository.create({
      task_id: taskId,
      ...createCommentDto,
    });
    return await this.commentsRepository.save(commentEntity);
  }

  async findAllByTaskId(page = 1, size = 10, taskId: string) {
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
  }
}
