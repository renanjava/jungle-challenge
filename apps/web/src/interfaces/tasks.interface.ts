import { TaskPriority, TaskStatus } from "@my-monorepo/shared-dtos";

export interface ITask {
  id: string;
  title: string;
  description: string;
  deadline: Date;
  priority: TaskPriority;
  status: TaskStatus;
}

export interface IPaginatedTasks {
  data: ITask[];
  total: number;
  page: number;
  size: number;
  totalPages: number;
}
