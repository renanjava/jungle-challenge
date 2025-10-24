import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';
import { HealthCheckController } from './health-check.controller';
import { LoggerModule } from '@my-monorepo/shared-logger';

@Module({
  imports: [
    TerminusModule,
    HttpModule,
    LoggerModule.forRoot({
      level: process.env.LOG_LEVEL,
      serviceName: 'API_GATEWAY',
    }),
  ],
  controllers: [HealthCheckController],
})
export class HealthCheckModule {}
