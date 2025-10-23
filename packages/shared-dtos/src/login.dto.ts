import { IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: "Email do usuário", example: "user@example.com" })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: "Senha do usuário", example: "password123" })
  password: string;
}
