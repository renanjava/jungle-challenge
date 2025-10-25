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
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AppService } from './app.service';
import { LoggerService } from '@my-monorepo/shared-logger';
import { catchError, firstValueFrom, throwError } from 'rxjs';
import {
  CreateTaskDto,
  LoginDto,
  RegisterDto,
  CreateTaskAssignmentDto,
  UpdateTaskAssignmentDto,
  UpdateTaskDto,
} from '@my-monorepo/shared-dtos';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { AppJwtService } from './jwt/app-jwt.service';
import { JwtRefreshGuard } from './jwt/guards/jwt-refresh.guard';

@Controller('api')
@ApiTags('API_GATEWAY')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly logger: LoggerService,
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
    @Inject('TASKS_SERVICE') private readonly tasksClient: ClientProxy,

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
    return await this.appJwt.signIn(userResponse.id, userResponse.email);
  }

  @Post('auth/refresh')
  @UseGuards(JwtRefreshGuard)
  refreshToken(@Req() req: any) {
    return this.appJwt.refreshAccessToken(req);
  }

  @Post('tasks')
  async createTask(@Body() createTaskDto: CreateTaskDto) {
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

  @Get('tasks/:id')
  async findByIdTask(@Param('id') id: string) {
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

  @Get('tasks')
  async findAllTask(@Query('page') page: string, @Query('size') size: string) {
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

  @Put('tasks/:id')
  async updateTask(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return await firstValueFrom(
      this.tasksClient
        .send({ cmd: 'task.updated' }, { id, updateTaskDto })
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

  @Post('tasks/assignment')
  async createTaskAssignment(
    @Body() createTaskAssignmentDto: CreateTaskAssignmentDto,
  ) {
    await firstValueFrom(
      this.authClient
        .send({ cmd: 'get-user-id' }, createTaskAssignmentDto.user_id)
        .pipe(
          catchError((error) =>
            throwError(
              () =>
                new HttpException(
                  error.message ||
                    `Erro ao tentar buscar usuário com o id ${createTaskAssignmentDto.user_id}`,
                  error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
                ),
            ),
          ),
        ),
    );
    await firstValueFrom(
      this.tasksClient
        .send({ cmd: 'get-task-id' }, createTaskAssignmentDto.task_id)
        .pipe(
          catchError((error) =>
            throwError(
              () =>
                new HttpException(
                  error.message ||
                    `Erro ao tentar buscar tarefa com o id ${createTaskAssignmentDto.task_id}`,
                  error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
                ),
            ),
          ),
        ),
    );
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
}
