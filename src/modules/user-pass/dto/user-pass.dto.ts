export class CreateUserPassDto {
  host: string;
  login: string;
  hashPass: string;
}

export class UpdateUserPassDto {
  host?: string;
  login?: string;
  hashPass?: string;
  isLeaked?: boolean;
}
