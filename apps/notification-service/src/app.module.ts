import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerModule } from '@my-monorepo/shared-logger';
import { envValidationSchema } from '@my-monorepo/shared-config';

@Module({
  imports: [
    LoggerModule.forRoot({
      level: process.env.LOG_LEVEL,
      serviceName: 'NOTIFICATION_SERVICE',
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: envValidationSchema,
      envFilePath: './../../packages/shared-config/.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.NOTIFICATION_DB_NAME,
      entities: [],
      synchronize: false,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
