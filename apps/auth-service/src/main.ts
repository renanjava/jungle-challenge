import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { LoggerService } from '@my-monorepo/shared-logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useLogger(app.get(LoggerService));

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
