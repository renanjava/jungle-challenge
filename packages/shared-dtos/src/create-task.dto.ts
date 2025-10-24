import { IsDate, IsEnum, IsNotEmpty, IsString, IsUUID } from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

export enum TaskPriority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  URGENT = "URGENT",
}

export enum TaskStatus {
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  REVIEW = "REVIEW",
  DONE = "DONE",
}

export class CreateTaskDto {
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({
    description: "ID do usuário (UUID)",
    example: "c75f7c66-e858-47d6-bb82-7ea5547c800c",
  })
  created_by_user_id: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: "Título da tarefa",
    example: "Refatoração",
  })
  title: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: "Descrição da tarefa",
    example: "Melhorar a legibilidade da lógica do serviço X",
  })
  description: string;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  @ApiProperty({
    description: "Prazo final da tarefa",
    example: "2026-01-01",
  })
  deadline: Date;

  @IsNotEmpty()
  @IsEnum(TaskPriority)
  @ApiProperty({
    description: "Prioridade da tarefa",
    example: "HIGH",
  })
  priority: TaskPriority;

  @IsNotEmpty()
  @IsEnum(TaskStatus)
  @ApiProperty({
    description: "Status da tarefa",
    example: "TODO",
  })
  status: TaskStatus;
}
