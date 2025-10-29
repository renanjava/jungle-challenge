/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { LoginDto } from '@my-monorepo/shared-dtos';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { RegisterDto } from '@my-monorepo/shared-dtos';
import * as bcrypt from 'bcrypt';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async register(dto: RegisterDto): Promise<User> {
    try {
      const user = this.usersRepository.create(dto);
      try {
        return await this.usersRepository.save(user);
      } catch (err: any) {
        if (err.code === '23505') {
          throw new ConflictException('Email ou nome de usuário já cadastrado');
        }
      }
    } catch (error) {
      throw new RpcException({
        statusCode: error.status || 500,
        message: error.message || 'Erro ao criar usuário',
      });
    }
  }

  async login(loginDto: LoginDto): Promise<User> {
    try {
      const user = await this.usersRepository.findOneBy({
        email: loginDto.email,
      });

      if (!user) {
        throw new NotFoundException(
          `Nenhum usuário encontrado com o email: ${loginDto.email}`,
        );
      }

      const isValidPassword = await bcrypt.compare(
        loginDto.password,
        user.password,
      );
      if (!isValidPassword) {
        throw new BadRequestException(`Senha inválida`);
      }
      return user;
    } catch (error) {
      throw new RpcException({
        statusCode: error.status || 500,
        message: error.message || 'Erro ao fazer login',
      });
    }
  }

  async findById(id: string) {
    try {
      return await this.usersRepository.findOneByOrFail({ id });
    } catch (error) {
      throw new RpcException({
        statusCode: error.status || 500,
        message: error.message || 'Erro ao buscar usuário',
      });
    }
  }
}
