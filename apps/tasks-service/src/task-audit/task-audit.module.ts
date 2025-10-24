import { Module } from '@nestjs/common';
import { TaskAuditService } from './task-audit.service';
import { TaskAuditController } from './task-audit.controller';
import { TaskAudit } from './entities/task-audit.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([TaskAudit])],
  controllers: [TaskAuditController],
  providers: [TaskAuditService],
})
export class TaskAuditModule {}
