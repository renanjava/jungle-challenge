/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Controller } from '@nestjs/common';
import { UsersService } from './users.service';
import { RegisterDto } from '@my-monorepo/shared-dtos';
import { UpdateUserDto } from '@my-monorepo/shared-dtos';
import { LoginDto } from '@my-monorepo/shared-dtos';
import { LoggerService } from '@my-monorepo/shared-logger';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly logger: LoggerService,
  ) {}

  @MessagePattern({ cmd: 'create_user' })
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

  @MessagePattern({ cmd: 'find_all_users' })
  async findAll() {
    this.logger.log("(GET) - Path '/' do UsersController");
    try {
      return await this.usersService.findAll();
    } catch (error) {
      throw new RpcException({
        statusCode: error.status || 500,
        message: error.message || 'Erro ao buscar usuários',
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

  @MessagePattern({ cmd: 'find_user' })
  async findOne(@Payload() id: string) {
    this.logger.log("(GET) - Path '/:id' do UsersController");
    try {
      return await this.usersService.findOne(id);
    } catch (error) {
      throw new RpcException({
        statusCode: error.status || 500,
        message: error.message || 'Erro ao buscar usuário',
      });
    }
  }

  @MessagePattern({ cmd: 'update_user' })
  async update(@Payload() data: { id: string; updateUserDto: UpdateUserDto }) {
    this.logger.log("(PATCH) - Path '/:id' do UsersController");
    try {
      return await this.usersService.update(data.id, data.updateUserDto);
    } catch (error) {
      throw new RpcException({
        statusCode: error.status || 500,
        message: error.message || 'Erro ao atualizar usuário',
      });
    }
  }

  @MessagePattern({ cmd: 'delete_user' })
  async remove(@Payload() id: string) {
    this.logger.log("(Delete) - Path '/:id' do UsersController");
    try {
      await this.usersService.remove(id);
      return { message: 'Usuário removido com sucesso' };
    } catch (error) {
      throw new RpcException({
        statusCode: error.status || 500,
        message: error.message || 'Erro ao remover usuário',
      });
    }
  }
}
