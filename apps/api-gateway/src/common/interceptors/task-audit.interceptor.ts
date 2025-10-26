/* eslint-disable @typescript-eslint/no-unsafe-return */

/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { TaskAuditAction, CreateTaskAuditDto } from '@my-monorepo/shared-dtos';
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
//import { LoggerService } from '@my-monorepo/shared-logger';

const TASK_AUDIT_KEY = 'taskAudit';

@Injectable()
export class TaskAuditInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    private readonly appService: AppService,
    //private readonly logger: LoggerService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const action = this.reflector.get<TaskAuditAction | undefined>(
      TASK_AUDIT_KEY,
      context.getHandler(),
    );
    const request = context.switchToHttp().getRequest();
    console.log({ request });

    const createTaskAuditDto: CreateTaskAuditDto = {
      user_id: request.user.userId,
      task_id: '',
      action,
      old_value: null,
      new_value: null,
    };

    if (request.method === 'DELETE') {
      createTaskAuditDto.task_id = request.params.id;
    }

    return next.handle().pipe(
      tap(async (response) => {
        console.log({ response });

        if (response.statusCode >= 400 && response.statusCode <= 502) {
          /*this.logger.error(
          'Erro ao tentar salvar o log da tarefa',
          request.path),*/
          return;
        }
        if ((response.task_id || response.id) && request.method != 'DELETE') {
          createTaskAuditDto.task_id = response.task_id ?? response.id;
          createTaskAuditDto.new_value = response;
        }
        if (request.method === 'DELETE') {
          createTaskAuditDto.old_value = response;
        }
        return await this.appService.createTaskAudit(createTaskAuditDto);
      }),
    );
  }
}

export const TaskAudit = (actionName?: TaskAuditAction) =>
  SetMetadata(TASK_AUDIT_KEY, actionName);
