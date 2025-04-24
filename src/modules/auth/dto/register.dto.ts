import { IsString, MinLength } from 'class-validator';
export class RegisterDto {
  @IsString()
  readonly login: string;

  @IsString()
  @MinLength(6)
  readonly password: string;
}
