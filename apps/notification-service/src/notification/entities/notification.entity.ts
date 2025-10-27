/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { NotificationType } from '@my-monorepo/shared-dtos';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  user_id: string;

  @Column({ type: 'enum', enum: NotificationType })
  type: NotificationType;

  @Column('jsonb')
  payload: Record<string, any>;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
