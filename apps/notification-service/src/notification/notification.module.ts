import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationGateway } from './notification.gateway';
import { LoggerModule } from '@my-monorepo/shared-logger';
import { Notification } from './entities/notification.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Notification]),
    LoggerModule.forRoot({
      level: process.env.LOG_LEVEL,
      serviceName: 'NOTIFICATION_SERVICE',
    }),
  ],
  providers: [NotificationGateway, NotificationService],
})
export class NotificationModule {}
