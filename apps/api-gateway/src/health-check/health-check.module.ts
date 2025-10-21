import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';
import { HealthCheckController } from './health-check.controller';
import { LoggerService } from '../logger/logger.service';

@Module({
  imports: [TerminusModule, HttpModule],
  providers: [LoggerService],
  controllers: [HealthCheckController],
})
export class HealthCheckModule {}
