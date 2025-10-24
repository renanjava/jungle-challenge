/* eslint-disable @typescript-eslint/no-unsafe-assignment */
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
import { LoginDto, RegisterDto } from '@my-monorepo/shared-dtos';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { AppJwtService } from './jwt/app-jwt.service';

@Controller('api')
@ApiTags('API_GATEWAY')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly logger: LoggerService,
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
    private readonly appJwt: AppJwtService,
  ) {}

  @Get()
  getHello(): string {
    this.logger.log("Path '/' do AppController");
    return this.appService.getHello();
  }

  @Post('auth/register')
  async register(@Body() registerDto: RegisterDto) {
    return firstValueFrom(
      this.authClient
        .send({ cmd: 'register_user' }, registerDto)
        .pipe(
          catchError((error) =>
            throwError(
              () =>
                new HttpException(
                  error.message || 'Erro ao registrar usuário',
                  error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
                ),
            ),
          ),
        ),
    );
  }

  @Post('auth/login')
  async login(@Body() loginDto: LoginDto) {
    const userResponse = await firstValueFrom(
      this.authClient
        .send({ cmd: 'login_user' }, loginDto)
        .pipe(
          catchError((error) =>
            throwError(
              () =>
                new HttpException(
                  error.message || 'Erro ao tentar logar-se',
                  error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
                ),
            ),
          ),
        ),
    );
    return await this.appJwt.signIn(userResponse.id, userResponse.username);
  }
}
