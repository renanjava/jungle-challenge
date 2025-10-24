import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { TaskAssignment } from './task-assignment/entities/task-assignment.entity';
import { TaskAudit } from './task-audit/entities/task-audit.entity';
import { Task } from './tasks/entities/task.entity';
import { Comment } from './comments/entities/comment.entity';

dotenv.config({ path: './../../packages/shared-config/.env' });

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.TASKS_DB_NAME,
  entities: [Task, TaskAssignment, Comment, TaskAudit],
  migrations: ['src/migrations/*.ts'],
  migrationsTableName: 'migrations',
  synchronize: false,
});
