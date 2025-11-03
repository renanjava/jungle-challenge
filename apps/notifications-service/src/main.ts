import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggerService } from '@my-monorepo/shared-logger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useLogger(app.get(LoggerService));
  app.useGlobalPipes(new ValidationPipe());

  app.enableCors({
    origin: '*',
    credentials: true,
  });

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL],
      queue: 'notifications_queue',
      noAck: true,
      queueOptions: {
        durable: true,
      },
      socketOptions: {
        heartbeatIntervalInSeconds: 60,
        reconnectTimeInSeconds: 5,
      },
    },
  });

  await app.startAllMicroservices();

  const port = process.env.NOTIFICATION_PORT || 3009;
  await app.listen(port);

  const logger = app.get(LoggerService);
  logger.log(`Notification Service rodando na porta ${port}`);
  logger.log(
    `WebSocket Gateway disponível em ws://localhost:${port}/notifications`,
  );
  logger.log(`RabbitMQ microservice conectado`);
}

bootstrap();
