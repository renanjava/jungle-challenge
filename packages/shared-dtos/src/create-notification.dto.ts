export class CreateNotificationDto {
  user_id: string;
  type: NotificationType;
  payload: Record<string, any>;
}

export enum NotificationType {
  TASK_ASSIGNED = "TASK_ASSIGNED",
  NEW_COMMENT = "NEW_COMMENT",
  STATUS_CHANGE = "STATUS_CHANGE",
}
