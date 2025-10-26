import { Module } from '@nestjs/common';
import { TaskAuditService } from './task-audit.service';
import { TaskAuditController } from './task-audit.controller';
import { TaskAudit } from './entities/task-audit.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from '@my-monorepo/shared-logger';

@Module({
  imports: [
    TypeOrmModule.forFeature([TaskAudit]),
    LoggerModule.forRoot({
      level: process.env.LOG_LEVEL,
      serviceName: 'TASKS_SERVICE',
    }),
  ],
  controllers: [TaskAuditController],
  providers: [TaskAuditService],
})
export class TaskAuditModule {}
