import { IsNotEmpty, IsString, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: "Email do usuário", example: "user@example.com" })
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @ApiProperty({ description: "Senha do usuário", example: "password123" })
  password: string;
}
