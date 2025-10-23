/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Controller } from '@nestjs/common';
import { UsersService } from './users.service';
import { RegisterDto } from '@my-monorepo/shared-dtos';
import { LoginDto } from '@my-monorepo/shared-dtos';
import { LoggerService } from '@my-monorepo/shared-logger';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly logger: LoggerService,
  ) {}

  @MessagePattern({ cmd: 'register_user' })
  async create(@Payload() registerDto: RegisterDto) {
    this.logger.log("(POST) - Path '/' do UsersController");
    try {
      return await this.usersService.create(registerDto);
    } catch (error) {
      throw new RpcException({
        statusCode: error.status || 500,
        message: error.message || 'Erro ao criar usuário',
      });
    }
  }

  @MessagePattern({ cmd: 'login_user' })
  async login(@Payload() loginDto: LoginDto) {
    this.logger.log("(POST) - Path '/login' do UsersController");
    try {
      return await this.usersService.login(loginDto);
    } catch (error) {
      throw new RpcException({
        statusCode: error.status || 500,
        message: error.message || 'Erro ao fazer login',
      });
    }
  }
}
