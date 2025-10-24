import { Module } from '@nestjs/common';
import { TaskAssignmentService } from './task-assignment.service';
import { TaskAssignmentController } from './task-assignment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskAssignment } from './entities/task-assignment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TaskAssignment])],
  controllers: [TaskAssignmentController],
  providers: [TaskAssignmentService],
})
export class TaskAssignmentModule {}
