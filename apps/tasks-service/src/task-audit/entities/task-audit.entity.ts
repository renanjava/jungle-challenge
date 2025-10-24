import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Task } from '../../tasks/entities/task.entity';

export enum TaskAuditAction {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  ASSIGN = 'ASSIGN',
  STATUS_CHANGE = 'STATUS_CHANGE',
}

@Entity('taskAudit')
export class TaskAudit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  user_id: string;

  @ManyToOne(() => Task, (task) => task.taskAudits, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'task_id' })
  task: Task;

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
