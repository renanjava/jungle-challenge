import { Module } from '@nestjs/common';
import { TaskAssignmentService } from './task-assignment.service';
import { TaskAssignmentController } from './task-assignment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskAssignment } from './entities/task-assignment.entity';
import { LoggerModule } from '@my-monorepo/shared-logger';

@Module({
  imports: [
    TypeOrmModule.forFeature([TaskAssignment]),
    LoggerModule.forRoot({
      level: process.env.LOG_LEVEL,
      serviceName: 'TASKS_SERVICE',
    }),
  ],
  controllers: [TaskAssignmentController],
  providers: [TaskAssignmentService],
})
export class TaskAssignmentModule {}
