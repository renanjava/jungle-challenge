/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { CreateNotificationDto } from '@my-monorepo/shared-dtos';
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
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
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly logger: LoggerService,
    private readonly jwtService: JwtService,
  ) {}

  afterInit(server: Server) {
    this.logger.log('WebSocket Gateway inicializado ✅');
    this.logger.log(`Namespace: /notifications`);
  }

  async handleConnection(client: Socket) {
    try {
      this.logger.log(`Cliente está tentando se conectar: ${client.id}`);

      const token =
        client.handshake.auth.token ||
        client.handshake.headers.authorization?.replace('Bearer ', '');

      if (!token) {
        this.logger.warn(`Cliente ${client.id} sem token`);
        throw new UnauthorizedException('Token não fornecido');
      }

      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_ACCESS_SECRET,
      });

      const userId = payload.sub || payload.id;
      client.data.userId = userId;
      await client.join(`user:${userId}`);

      this.logger.log(
        `✅ Usuário ${userId} conectado via WebSocket (client: ${client.id})`,
      );
      try {
        const room = this.server.sockets.adapter.rooms.get(`user:${userId}`);
        const count = room ? room.size : 0;
        this.logger.log(`Room user:${userId} size after join: ${count}`);
      } catch (e: any) {
        this.logger.warn(
          `Não foi possível ler rooms adapter: ${e?.message || e}`,
        );
      }

      client.emit('connected', { userId, message: 'Conectado com sucesso!' });
    } catch (error) {
      this.logger.error(
        `❌ WebSocket auth failed: ${error.message}`,
        '/notifications',
      );
      client.emit('error', { message: 'Autenticação falhou' });
      client.disconnect();
    }
  }

  @SubscribeMessage('joinTask')
  async handleJoinTask(client: Socket, payload: { taskId: string } | string) {
    try {
      let taskId: string;
      if (typeof payload === 'string') taskId = payload;
      else if (payload && typeof (payload as any).taskId === 'string')
        taskId = (payload as any).taskId;
      else {
        taskId = '';
      }

      if (!taskId) {
        client.emit('error', { message: 'Invalid taskId' });
        return;
      }

      if (!client.data.userId) {
        client.emit('error', { message: 'Not authenticated' });
        return;
      }
      await client.join(`task:${taskId}`);
      this.logger.log(
        `✅ Usuário ${client.data.userId} entrou na sala task:${taskId} (client: ${client.id})`,
      );
      try {
        const room = this.server.sockets.adapter.rooms.get(`task:${taskId}`);
        const count = room ? room.size : 0;
        this.logger.log(`Room task:${taskId} size after join: ${count}`);
      } catch (e: any) {
        this.logger.warn(
          `Não foi possível ler rooms adapter: ${e?.message || e}`,
        );
      }
      client.emit('joinedTask', { taskId });
    } catch (err: any) {
      this.logger.error(
        `Erro ao juntar-se à sala task: ${err?.message || err}`,
        '/notifications',
      );
      client.emit('error', { message: 'Failed to join task room' });
    }
  }

  @SubscribeMessage('leaveTask')
  async handleLeaveTask(client: Socket, payload: { taskId: string } | string) {
    try {
      let taskId: string;
      if (typeof payload === 'string') taskId = payload;
      else if (payload && typeof (payload as any).taskId === 'string')
        taskId = (payload as any).taskId;
      else {
        taskId = '';
      }

      if (!taskId) {
        client.emit('error', { message: 'Invalid taskId' });
        return;
      }

      await client.leave(`task:${taskId}`);
      this.logger.log(
        `❌ Usuário ${client.data.userId} saiu da sala task:${taskId} (client: ${client.id})`,
      );
      client.emit('leftTask', { taskId });
    } catch (err: any) {
      this.logger.error(
        `Erro ao sair da sala task: ${err?.message || err}`,
        '/notifications',
      );
      client.emit('error', { message: 'Failed to leave task room' });
    }
  }

  handleDisconnect(client: Socket) {
    const userId = client.data.userId;
    this.logger.log(`❌ Usuário ${userId} desconectado (client: ${client.id})`);
  }

  emitNotification(notification: CreateNotificationDto) {
    this.server
      .to(`user:${notification.user_id}`)
      .emit('notification', notification);
    const taskId = notification.payload?.taskId;
    if (taskId) {
      this.server.to(`task:${taskId}`).emit('taskNotification', notification);
      this.logger.log(
        `📨 Notificação também enviada para a sala task:${taskId}: ${notification.type}`,
      );
    }

    this.logger.log(
      `📨 Notificação enviada para o usuário ${notification.user_id}: ${notification.type}`,
    );
  }
}
