import { Controller } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from '@my-monorepo/shared-dtos';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { LoggerService } from '@my-monorepo/shared-logger';

@Controller('comments')
export class CommentsController {
  constructor(
    private readonly commentsService: CommentsService,
    private readonly logger: LoggerService,
  ) {}

  @MessagePattern({ cmd: 'task.comment.created' })
  async create(
    @Payload() payload: { createCommentDto: CreateCommentDto; taskId: string },
  ) {
    this.logger.log("(POST) - Path '/comments' do CommentsController");
    return await this.commentsService.create(
      payload.taskId,
      payload.createCommentDto,
    );
  }

  @MessagePattern({ cmd: 'get-all-tasks-comments-by-task' })
  findAll(@Payload() payload: { page: number; size: number; taskId: string }) {
    this.logger.log(
      "(GET) - Path '/tasks/:id/comments?page=&size' do CommentsController",
    );
    return this.commentsService.findAllByTaskId(
      payload.page,
      payload.size,
      payload.taskId,
    );
  }
}
