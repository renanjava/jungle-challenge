/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  CreateTaskDto,
  RegisterDto,
  UpdateTaskDto,
  CreateTaskAssignmentDto,
  CreateCommentDto,
} from '@my-monorepo/shared-dtos';
import { LoginDto } from '@my-monorepo/shared-dtos';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, firstValueFrom, throwError } from 'rxjs';
import { AppJwtService } from './jwt/app-jwt.service';

@Injectable()
export class AppService {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
    @Inject('TASKS_SERVICE') private readonly tasksClient: ClientProxy,
    private readonly appJwt: AppJwtService,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async getUserById(id: string) {
    return await firstValueFrom(
      this.authClient
        .send({ cmd: 'get-user-id' }, id)
        .pipe(
          catchError((error) =>
            throwError(
              () =>
                new HttpException(
                  error.message ||
                    `Erro ao tentar buscar usuário com o id ${id}`,
                  error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
                ),
            ),
          ),
        ),
    );
  }

  async authUserRegister(registerDto: RegisterDto) {
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

  async authUserLogin(loginDto: LoginDto) {
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
    return await this.appJwt.signIn(userResponse.id, userResponse.email);
  }

  async createTasks(createTaskDto: CreateTaskDto) {
    return await firstValueFrom(
      this.tasksClient
        .send({ cmd: 'task.created' }, createTaskDto)
        .pipe(
          catchError((error) =>
            throwError(
              () =>
                new HttpException(
                  error.message || 'Erro ao tentar criar Task',
                  error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
                ),
            ),
          ),
        ),
    );
  }

  async findOneTask(id: string) {
    return await firstValueFrom(
      this.tasksClient
        .send({ cmd: 'get-task-id' }, id)
        .pipe(
          catchError((error) =>
            throwError(
              () =>
                new HttpException(
                  error.message || 'Erro ao tentar buscar uma Task',
                  error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
                ),
            ),
          ),
        ),
    );
  }

  async findAllTasksWithPagination(page: number, size: number) {
    return await firstValueFrom(
      this.tasksClient
        .send({ cmd: 'get-all-task' }, { page, size })
        .pipe(
          catchError((error) =>
            throwError(
              () =>
                new HttpException(
                  error.message || 'Erro ao tentar buscar todas Task',
                  error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
                ),
            ),
          ),
        ),
    );
  }

  async updateOneTask(id: string, updateTaskDto: UpdateTaskDto) {
    return await firstValueFrom(
      this.tasksClient
        .send({ cmd: 'task.updated' }, { id, updateTaskDto })
        .pipe(
          catchError((error) =>
            throwError(
              () =>
                new HttpException(
                  error.message || 'Erro ao tentar atualizar uma Task',
                  error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
                ),
            ),
          ),
        ),
    );
  }

  async deleteOneTask(id: string) {
    return await firstValueFrom(
      this.tasksClient
        .send({ cmd: 'task.deleted' }, id)
        .pipe(
          catchError((error) =>
            throwError(
              () =>
                new HttpException(
                  error.message || 'Erro ao tentar deletar uma Task',
                  error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
                ),
            ),
          ),
        ),
    );
  }

  async createTaskAssignment(createTaskAssignmentDto: CreateTaskAssignmentDto) {
    await this.getUserById(createTaskAssignmentDto.user_id);
    return await firstValueFrom(
      this.tasksClient
        .send({ cmd: 'task-assignment.created' }, createTaskAssignmentDto)
        .pipe(
          catchError((error) =>
            throwError(
              () =>
                new HttpException(
                  error.message ||
                    'Erro ao tentar vincular usuário à uma tarefa',
                  error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
                ),
            ),
          ),
        ),
    );
  }

  async createTaskComment(createCommentDto: CreateCommentDto, taskId: string) {
    await this.getUserById(createCommentDto.user_id);
    return await firstValueFrom(
      this.tasksClient
        .send({ cmd: 'task.comment.created' }, { createCommentDto, taskId })
        .pipe(
          catchError((error) =>
            throwError(
              () =>
                new HttpException(
                  error.message || 'Erro ao tentar criar Task',
                  error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
                ),
            ),
          ),
        ),
    );
  }

  async findAllCommentsByTask(page: string, size: string, taskId: string) {
    return await firstValueFrom(
      this.tasksClient
        .send({ cmd: 'get-all-tasks-comments-by-task' }, { page, size, taskId })
        .pipe(
          catchError((error) =>
            throwError(
              () =>
                new HttpException(
                  error.message ||
                    'Erro ao tentar buscar todos comentários de uma Task',
                  error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
                ),
            ),
          ),
        ),
    );
  }
}
