/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Post,
} from '@nestjs/common';
import { AppService } from './app.service';
import { LoggerService } from '@my-monorepo/shared-logger';
import { catchError, firstValueFrom, throwError } from 'rxjs';
import { RegisterDto } from '@my-monorepo/shared-dtos';
import { ClientProxy } from '@nestjs/microservices';

@Controller('api')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly logger: LoggerService,
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
  ) {}

  @Get()
  getHello(): string {
    this.logger.log("Path '/' do AppController");
    return this.appService.getHello();
  }

  @Post('auth/register')
  async create(@Body() registerDto: RegisterDto) {
    return firstValueFrom(
      this.authClient
        .send({ cmd: 'create_user' }, registerDto)
        .pipe(
          catchError((error) =>
            throwError(
              () =>
                new HttpException(
                  error.message || 'Erro ao criar usuário',
                  error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
                ),
            ),
          ),
        ),
    );
  }
}
