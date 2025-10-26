export class CreateTaskAuditDto {
  user_id: string;
  task_id: string;
  action: string;
  old_value: Record<string, any>;
  new_value: Record<string, any>;
}

export enum TaskAuditAction {
  CREATE = "CREATE",
  UPDATE = "UPDATE",
  DELETE = "DELETE",
  ASSIGN = "ASSIGN",
  STATUS_CHANGE = "STATUS_CHANGE",
}
