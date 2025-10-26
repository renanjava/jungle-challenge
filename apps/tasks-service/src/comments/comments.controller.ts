/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Controller, Get } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from '@my-monorepo/shared-dtos';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { LoggerService } from '@my-monorepo/shared-logger';

@Controller('comments')
export class CommentsController {
  constructor(
    private readonly commentsService: CommentsService,
    private readonly loggerService: LoggerService,
  ) {}

  @MessagePattern({ cmd: 'task.comment.created' })
  async create(
    @Payload() payload: { createCommentDto: CreateCommentDto; taskId: string },
  ) {
    this.loggerService.log("(POST) - Path '/comments' do CommentsController");
    try {
      return await this.commentsService.create(
        payload.taskId,
        payload.createCommentDto,
      );
    } catch (error) {
      throw new RpcException({
        statusCode: error.status || 500,
        message: error.message || 'Erro ao criar comentário para a tarefa',
      });
    }
  }

  @MessagePattern({ cmd: 'get-all-tasks-comments' })
  findAll() {
    return this.commentsService.findAll();
  }
}
