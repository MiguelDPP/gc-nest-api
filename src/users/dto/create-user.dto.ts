import {
  IsEmail,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(4)
  username: string;

  @IsString()
  firstName: string;

  @IsString()
  @IsOptional()
  secondName?: string;

  @IsString()
  surname: string;
  @IsOptional()
  secondSurname?: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(20)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
    {
      message:
        'La contraseña debe tener al menos una letra mayúscula, una letra minúscula, un número y un carácter especial.',
    },
  )
  password: string;
  @IsInt()
  municipalityId: number;

  @IsString()
  @IsOptional()
  photo?: string;
}
