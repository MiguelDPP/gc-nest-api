import { IsOptional, IsString, MinLength } from 'class-validator';

export class CreateErrorDto {
  @IsString()
  @MinLength(3)
  title: string;

  @IsString()
  @MinLength(10)
  description: string;

  @IsOptional()
  @IsString()
  url: string;
}
