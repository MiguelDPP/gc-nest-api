import { IsString, MinLength } from 'class-validator';

export class LoginUserDto {
  // Como poner que recibe email o username
  @IsString()
  readonly username: string;

  @IsString()
  @MinLength(4)
  readonly password: string;
}
