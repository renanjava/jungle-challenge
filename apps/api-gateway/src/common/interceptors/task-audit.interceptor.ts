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

const TASK_AUDIT_KEY = 'taskAudit';

@Injectable()
export class TaskAuditInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const action = this.reflector.get<TaskAuditAction | undefined>(
      TASK_AUDIT_KEY,
      context.getHandler(),
    );

    console.log('Before...', action);

    const now = Date.now();
    return next
      .handle()
      .pipe(tap(() => console.log(`After... ${Date.now() - now}ms`)));
  }
}

export const TaskAudit = (actionName?: TaskAuditAction) =>
  SetMetadata(TASK_AUDIT_KEY, actionName);
