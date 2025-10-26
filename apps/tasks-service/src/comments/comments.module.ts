import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { LoggerModule } from '@my-monorepo/shared-logger';
import { TasksModule } from '../tasks/tasks.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Comment]),
    LoggerModule.forRoot({
      level: process.env.LOG_LEVEL,
      serviceName: 'TASKS_SERVICE',
    }),
    TasksModule,
  ],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
