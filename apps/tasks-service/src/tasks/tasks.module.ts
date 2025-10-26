import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { LoggerModule } from '@my-monorepo/shared-logger';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task]),
    LoggerModule.forRoot({
      level: process.env.LOG_LEVEL,
      serviceName: 'TASKS_SERVICE',
    }),
  ],
  controllers: [TasksController],
  providers: [TasksService],
  exports: [TasksService],
})
export class TasksModule {}
