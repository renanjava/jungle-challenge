import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from '@my-monorepo/shared-dtos';
import { NotificationGateway } from './notification.gateway';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';

@Injectable()
export class NotificationService {
  constructor(
    private readonly notificationGateway: NotificationGateway,
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
  ) {}
  async create(createNotificationDto: CreateNotificationDto) {
    const notification = this.notificationRepository.create(
      createNotificationDto,
    );
    const createdNotification =
      await this.notificationRepository.save(notification);
    if (createdNotification) {
      this.notificationGateway.emitNotification(createNotificationDto);
    }
    return createdNotification;
  }
}
