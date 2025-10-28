/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { CreateNotificationDto } from '@my-monorepo/shared-dtos';
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { LoggerService } from '@my-monorepo/shared-logger';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
  },
  namespace: '/notifications',
})
export class NotificationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly logger: LoggerService,
    private readonly jwtService: JwtService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      this.logger.log(`Cliente está tentando se conectar: ${client.id}`);

      const token =
        client.handshake.auth.token ||
        client.handshake.headers.authorization?.replace('Bearer ', '');

      if (!token) {
        throw new UnauthorizedException('Token não fornecido');
      }

      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_ACCESS_SECRET,
      });

      const userId = payload.sub || payload.id;
      client.data.userId = userId;
      await client.join(`user:${userId}`);
      this.logger.log(
        `Usuário ${userId} conectado via WebSocket (client: ${client.id})`,
      );

      client.emit('connected', { userId, message: 'Conectado com sucesso!' });
    } catch (error) {
      this.logger.error(
        `WebSocket auth failed: ${error.message}`,
        '/notifications',
      );
      client.emit('error', { message: 'Autenticação falhou' });
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const userId = client.data.userId;
    this.logger.log(`Usuário ${userId} desconectado (client: ${client.id})`);
  }

  emitNotification(notification: CreateNotificationDto) {
    this.server
      .to(`user:${notification.user_id}`)
      .emit('notification', notification);

    this.logger.log(
      `Notificação enviada para o usuário ${notification.user_id}: ${notification.type}`,
    );
  }
}
