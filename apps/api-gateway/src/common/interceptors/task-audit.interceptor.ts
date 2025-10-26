/* eslint-disable @typescript-eslint/no-misused-promises */
import { CreateTaskAuditDto } from '@my-monorepo/shared-dtos';
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { TaskAuditAction } from '@my-monorepo/shared-dtos';
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AppService } from '../../app.service';

const TASK_AUDIT_KEY = 'taskAudit';

@Injectable()
export class TaskAuditInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    private readonly appService: AppService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const action = this.reflector.get<TaskAuditAction | undefined>(
      TASK_AUDIT_KEY,
      context.getHandler(),
    );
    const request = context.switchToHttp().getRequest();

    const createTaskAuditDto: CreateTaskAuditDto = {
      user_id: request.user.userId,
      task_id: '',
      action,
      old_value: null,
      new_value: null,
    };

    return next.handle().pipe(
      tap(async (response) => {
        createTaskAuditDto.task_id = response.id;
        createTaskAuditDto.new_value = response;
        await this.appService.createTaskAudit(createTaskAuditDto);
      }),
    );
  }
}

export const TaskAudit = (actionName?: TaskAuditAction) =>
  SetMetadata(TASK_AUDIT_KEY, actionName);
