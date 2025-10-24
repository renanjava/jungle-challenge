import { PartialType } from '@nestjs/mapped-types';
import { CreateTaskAuditDto } from './create-task-audit.dto';

export class UpdateTaskAuditDto extends PartialType(CreateTaskAuditDto) {}
