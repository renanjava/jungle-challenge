/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  RABBITMQ_GET_USER_ID,
  RABBITMQ_LOGIN_USER,
  RABBITMQ_REGISTER_USER,
} from '@my-monorepo/shared-config';
import { Controller } from '@nestjs/common';
import { UsersService } from './users.service';
import { RegisterDto } from '@my-monorepo/shared-dtos';
import { LoginDto } from '@my-monorepo/shared-dtos';
import { LoggerService } from '@my-monorepo/shared-logger';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly logger: LoggerService,
  ) {}

  @MessagePattern({ cmd: RABBITMQ_REGISTER_USER })
  async create(@Payload() registerDto: RegisterDto) {
    this.logger.log("(POST) - Path '/register' do UsersController");
    return await this.usersService.register(registerDto);
  }

  @MessagePattern({ cmd: RABBITMQ_LOGIN_USER })
  async login(@Payload() loginDto: LoginDto) {
    this.logger.log("(POST) - Path '/login' do UsersController");
    return await this.usersService.login(loginDto);
  }

  @MessagePattern({ cmd: RABBITMQ_GET_USER_ID })
  async findById(@Payload() id: string) {
    this.logger.log("(GET) - Path '/user/:id' do UsersController");
    return await this.usersService.findById(id);
  }
}
