import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsUUID } from "class-validator";
export class CreateCommentDto {
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({
    description: "ID do usuário",
    example: "ca10edd5-ed10-460d-aa96-0b18495814e0",
  })
  user_id: string;

  @IsNotEmpty()
  @ApiProperty({
    description: "Comentário para a tarefa",
    example: "Peguei pra fazer hoje e acredito que termino amanhã",
  })
  text: string;
}
