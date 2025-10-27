/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { CreateNotificationDto } from '@my-monorepo/shared-dtos';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway()
export class NotificationGateway {
  @WebSocketServer()
  server: Server;

  emitNotification(notification: CreateNotificationDto) {
    this.server.to(notification.user_id).emit('notification', notification);
  }
}
