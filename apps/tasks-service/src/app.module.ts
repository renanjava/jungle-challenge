import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksModule } from './tasks/tasks.module';
import { TaskAssignmentModule } from './task-assignment/task-assignment.module';
import { CommentsModule } from './comments/comments.module';
import { TaskAuditModule } from './task-audit/task-audit.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './tasks/entities/task.entity';
import { TaskAssignment } from './task-assignment/entities/task-assignment.entity';
import { Comment } from './comments/entities/comment.entity';
import { TaskAudit } from './task-audit/entities/task-audit.entity';
import { envValidationSchema } from '@my-monorepo/shared-config/';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from '@my-monorepo/shared-logger';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: envValidationSchema,
      envFilePath: './../../packages/shared-config/.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.TASKS_DB_NAME,
      entities: [Task, TaskAssignment, Comment, TaskAudit],
      synchronize: false,
    }),
    LoggerModule.forRoot({
      level: process.env.LOG_LEVEL,
      serviceName: 'TASKS_SERVICE',
    }),
    TasksModule,
    TaskAssignmentModule,
    CommentsModule,
    TaskAuditModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
