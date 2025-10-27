/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { CreateNotificationDto } from '@my-monorepo/shared-dtos';
import { LoggerService } from '@my-monorepo/shared-logger';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { NotificationService } from './notification.service';
import { RABBITMQ_CREATE_NOTIFICATION } from '@my-monorepo/shared-config';

@Controller('notifications')
export class NotificationController {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly logger: LoggerService,
  ) {}

  @MessagePattern({ cmd: RABBITMQ_CREATE_NOTIFICATION })
  async create(@Payload() createNotificationDto: CreateNotificationDto) {
    this.logger.log("(POST) - Path '/create' do NotificationController");
    return await this.notificationService.create(createNotificationDto);
  }
}
