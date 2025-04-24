import { IsString, IsInt } from 'class-validator';

export class AddUserPassDto {
  @IsInt()
  readonly userId: number;

  @IsString()
  readonly host: string;

  @IsString()
  readonly login: string;

  @IsString()
  readonly password: string;
}
