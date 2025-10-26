import { Task } from '../../tasks/entities/task.entity';
export declare class Comment {
    id: string;
    user_id: string;
    task: Task;
    task_id: string;
    text: string;
    createdAt: Date;
    updatedAt: Date;
}
