/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { LoggerService } from '@my-monorepo/shared-logger';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly logger: LoggerService,
  ) {}

  @Get()
  getHello(): string {
    this.logger.log("Path '/' do AppController");
    return this.appService.getHello();
  }
}
