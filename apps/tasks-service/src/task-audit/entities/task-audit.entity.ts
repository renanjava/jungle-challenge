import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { TaskAuditAction } from '@my-monorepo/shared-dtos';

@Entity('taskAudit')
export class TaskAudit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  user_id: string;

  @Column({ type: 'uuid' })
  task_id: string;

  @Column({
    type: 'enum',
    enum: TaskAuditAction,
  })
  action: string;

  @Column('jsonb', { nullable: true })
  old_value: Record<string, any>;

  @Column('jsonb', { nullable: true })
  new_value: Record<string, any>;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
