import { Controller, Get, Post, Body } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from '@my-monorepo/shared-dtos';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { LoggerService } from '@my-monorepo/shared-logger';

@Controller('comments')
export class CommentsController {
  constructor(
    private readonly commentsService: CommentsService,
    private readonly loggerService: LoggerService,
  ) {}

  @MessagePattern({ cmd: 'task.comment.created' })
  create(
    @Payload() payload: { createCommentDto: CreateCommentDto; taskId: string },
  ) {
    this.loggerService.log("(POST) - Path '/comments' do CommentsController");
    return this.commentsService.create(
      payload.taskId,
      payload.createCommentDto,
    );
  }

  @Get()
  findAll() {
    return this.commentsService.findAll();
  }
}
