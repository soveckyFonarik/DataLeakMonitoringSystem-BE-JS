import { IsString } from 'class-validator';

export class LoginDto {
  @IsString()
  readonly login: string;

  @IsString()
  readonly password: string;
}
