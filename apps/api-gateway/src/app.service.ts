/* eslint-disable @typescript-eslint/no-unsafe-call */
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
  CreateTaskAuditDto,
  NotificationType,
} from '@my-monorepo/shared-dtos';
import {
  RABBITMQ_CREATE_NOTIFICATION,
  RABBITMQ_CREATE_TASK_AUDIT,
  RABBITMQ_GET_ALL_COMMENTS_BY_TASK,
  RABBITMQ_GET_ALL_TASK,
  RABBITMQ_GET_TASK_ID,
  RABBITMQ_GET_USER_ID,
  RABBITMQ_LOGIN_USER,
  RABBITMQ_REGISTER_USER,
  RABBITMQ_TASK_ASSIGNMENT_CREATED,
  RABBITMQ_TASK_COMMENT_CREATED,
  RABBITMQ_TASK_CREATED,
  RABBITMQ_TASK_DELETED,
  RABBITMQ_TASK_UPDATED,
} from '@my-monorepo/shared-config';
import { LoginDto } from '@my-monorepo/shared-dtos';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, firstValueFrom, throwError } from 'rxjs';
import { AppJwtService } from './common/auth/app-jwt.service';

@Injectable()
export class AppService {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
    @Inject('TASKS_SERVICE') private readonly tasksClient: ClientProxy,
    @Inject('NOTIFICATIONS_SERVICE')
    private readonly notificationsClient: ClientProxy,
    private readonly appJwt: AppJwtService,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async getUserById(id: string) {
    return await firstValueFrom(
      this.authClient
        .send({ cmd: RABBITMQ_GET_USER_ID }, id)
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
        .send({ cmd: RABBITMQ_REGISTER_USER }, registerDto)
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
        .send({ cmd: RABBITMQ_LOGIN_USER }, loginDto)
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
        .send({ cmd: RABBITMQ_TASK_CREATED }, createTaskDto)
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
        .send({ cmd: RABBITMQ_GET_TASK_ID }, id)
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
        .send({ cmd: RABBITMQ_GET_ALL_TASK }, { page, size })
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
    const updatedTask = await firstValueFrom(
      this.tasksClient
        .send({ cmd: RABBITMQ_TASK_UPDATED }, { id, updateTaskDto })
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
    if (updateTaskDto.status && updatedTask) {
      if (updatedTask.assignments && Array.isArray(updatedTask.assignments)) {
        updatedTask.assignments.forEach((assignment: any) => {
          this.notificationsClient.emit(RABBITMQ_CREATE_NOTIFICATION, {
            user_id: assignment.user_id,
            type: NotificationType.STATUS_CHANGE,
            payload: {
              title: `Status da tarefa "${updatedTask.title}" foi alterado para ${updateTaskDto.status}`,
              taskId: id,
              newStatus: updateTaskDto.status,
            },
          });
        });
      }
    }
    return updatedTask;
  }

  async deleteOneTask(id: string) {
    return await firstValueFrom(
      this.tasksClient
        .send({ cmd: RABBITMQ_TASK_DELETED }, id)
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
    const newUser = await this.getUserById(createTaskAssignmentDto.user_id);
    const task = await this.findOneTask(createTaskAssignmentDto.task_id);
    const taskAssignment = await firstValueFrom(
      this.tasksClient
        .send(
          { cmd: RABBITMQ_TASK_ASSIGNMENT_CREATED },
          createTaskAssignmentDto,
        )
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

    if (task.assignments && Array.isArray(task.assignments)) {
      for (const assignment of task.assignments) {
        if (assignment.user_id !== createTaskAssignmentDto.user_id) {
          this.notificationsClient.emit(RABBITMQ_CREATE_NOTIFICATION, {
            user_id: assignment.user_id,
            type: NotificationType.TASK_ASSIGNED,
            payload: {
              title: `${newUser.name || newUser.email} entrou na tarefa "${task.title}"`,
              taskId: task.id,
              newUserId: createTaskAssignmentDto.user_id,
              newUserName: newUser.name || newUser.email,
            },
          });
          await new Promise((resolve) => setTimeout(resolve, 150));
        }
      }
    }

    return taskAssignment;
  }

  async createTaskComment(createCommentDto: CreateCommentDto, taskId: string) {
    await this.getUserById(createCommentDto.user_id);
    const comment = await firstValueFrom(
      this.tasksClient
        .send(
          { cmd: RABBITMQ_TASK_COMMENT_CREATED },
          { createCommentDto, taskId },
        )
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

    const task = await this.findOneTask(taskId);
    if (task.assignments && Array.isArray(task.assignments)) {
      for (const assignment of task.assignments) {
        if (assignment.user_id !== createCommentDto.user_id) {
          this.notificationsClient.emit(RABBITMQ_CREATE_NOTIFICATION, {
            user_id: assignment.user_id,
            type: NotificationType.NEW_COMMENT,
            payload: {
              title: `Novo comentário na tarefa "${task.title}"`,
              taskId: task.id,
              commentId: comment.id,
            },
          });
          await new Promise((resolve) => setTimeout(resolve, 120));
        }
      }
    }

    return comment;
  }

  async findAllCommentsByTask(page: string, size: string, taskId: string) {
    return await firstValueFrom(
      this.tasksClient
        .send(
          { cmd: RABBITMQ_GET_ALL_COMMENTS_BY_TASK },
          { page, size, taskId },
        )
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

  async createTaskAudit(createTaskAuditDto: CreateTaskAuditDto) {
    await this.getUserById(createTaskAuditDto.user_id);
    return await firstValueFrom(
      this.tasksClient
        .send({ cmd: RABBITMQ_CREATE_TASK_AUDIT }, createTaskAuditDto)
        .pipe(
          catchError((error) =>
            throwError(
              () =>
                new HttpException(
                  error.message || 'Erro ao tentar salvar log na Audit Task',
                  error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
                ),
            ),
          ),
        ),
    );
  }
}
