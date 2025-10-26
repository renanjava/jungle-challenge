/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import { LoggerService } from '@my-monorepo/shared-logger';
import {
  CreateTaskDto,
  LoginDto,
  RegisterDto,
  CreateTaskAssignmentDto,
  UpdateTaskDto,
  CreateCommentDto,
  TaskAuditAction,
} from '@my-monorepo/shared-dtos';
import { ApiTags } from '@nestjs/swagger';
import { AppJwtService } from './common/auth/app-jwt.service';
import { JwtRefreshGuard } from './common/guards/jwt-refresh.guard';
import {
  TaskAudit,
  TaskAuditInterceptor,
} from './common/interceptors/task-audit.interceptor';

@Controller('api')
@ApiTags('API_GATEWAY')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly logger: LoggerService,
    private readonly appJwt: AppJwtService,
  ) {}

  @Get()
  getHello(): string {
    this.logger.log("Path '/' do AppController");
    return this.appService.getHello();
  }

  @Post('auth/register')
  async register(@Body() registerDto: RegisterDto) {
    return await this.appService.authUserRegister(registerDto);
  }

  @Post('auth/login')
  async login(@Body() loginDto: LoginDto) {
    return await this.appService.authUserLogin(loginDto);
  }

  @Post('auth/refresh')
  @UseGuards(JwtRefreshGuard)
  refreshToken(@Req() req: any) {
    return this.appJwt.refreshAccessToken(req);
  }

  @Post('tasks')
  @UseInterceptors(TaskAuditInterceptor)
  @TaskAudit(TaskAuditAction.CREATE)
  async createTask(@Body() createTaskDto: CreateTaskDto) {
    return await this.appService.createTasks(createTaskDto);
  }

  @Get('tasks/:id')
  async findByIdTask(@Param('id') id: string) {
    return await this.appService.findOneTask(id);
  }

  @Get('tasks')
  async findAllTask(@Query('page') page: number, @Query('size') size: number) {
    return await this.appService.findAllTasksWithPagination(page, size);
  }

  @Put('tasks/:id')
  async updateTask(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return await this.appService.updateOneTask(id, updateTaskDto);
  }

  @Delete('tasks/:id')
  async deleteTask(@Param('id') id: string) {
    return await this.appService.deleteOneTask(id);
  }

  @Post('tasks/assignment')
  async createTaskAssignment(
    @Body() createTaskAssignmentDto: CreateTaskAssignmentDto,
  ) {
    return await this.appService.createTaskAssignment(createTaskAssignmentDto);
  }

  @Post('tasks/:id/comments')
  async createTaskComment(
    @Body() createCommentDto: CreateCommentDto,
    @Param('id') taskId: string,
  ) {
    return await this.appService.createTaskComment(createCommentDto, taskId);
  }

  @Get('tasks/:id/comments')
  async findAllCommentsByTask(
    @Query('page') page: string,
    @Query('size') size: string,
    @Param('id') taskId: string,
  ) {
    return await this.appService.findAllCommentsByTask(page, size, taskId);
  }
}
