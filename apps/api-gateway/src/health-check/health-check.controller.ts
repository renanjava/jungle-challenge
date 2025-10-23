/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
} from '@nestjs/terminus';
import { LoggerService } from '@my-monorepo/shared-logger';

@Controller('health-check')
export class HealthCheckController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private readonly logger: LoggerService,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    this.logger.log("Path '/' do HealthCheckController");
    return this.health.check([
      () => this.http.pingCheck('api-gateway', 'http://localhost:3001'),
    ]);
  }
}
