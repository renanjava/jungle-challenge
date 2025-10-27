/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { TaskAuditAction, CreateTaskAuditDto } from '@my-monorepo/shared-dtos';
import {
  Injectable,
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
export class TaskAuditInterceptor {
  constructor(
    private readonly reflector: Reflector,
    private readonly appService: AppService,
    //private readonly logger: LoggerService,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
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

    if (request.method != 'POST') {
      createTaskAuditDto.task_id = request.params.id;
    }

    if (action === TaskAuditAction.UPDATE) {
      createTaskAuditDto.old_value = await this.appService.findOneTask(
        createTaskAuditDto.task_id,
      );
    }

    return next.handle().pipe(
      tap(async (response) => {
        if (response.statusCode >= 400 && response.statusCode <= 502) {
          /*this.logger.error(
          'Erro ao tentar salvar o log da tarefa',
          request.path),*/
          return;
        }

        if (request.method === 'DELETE') {
          createTaskAuditDto.old_value = response;
          return await this.appService.createTaskAudit(createTaskAuditDto);
        }

        if (response.task_id || response.id) {
          createTaskAuditDto.task_id = response.task_id ?? response.id;
          createTaskAuditDto.new_value = response;
        }

        if (
          createTaskAuditDto.old_value.status !=
            createTaskAuditDto.new_value.status &&
          createTaskAuditDto.action == 'UPDATE'
        ) {
          createTaskAuditDto.action = TaskAuditAction.STATUS_CHANGE;
        }
        return await this.appService.createTaskAudit(createTaskAuditDto);
      }),
    );
  }
}

export const TaskAudit = (actionName?: TaskAuditAction) =>
  SetMetadata(TASK_AUDIT_KEY, actionName);
