import { IsHexColor, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateLabelDto {
  @IsString()
  @MinLength(3)
  name: string;

  @IsString()
  @MinLength(3)
  description: string;

  @IsHexColor()
  @IsOptional()
  color: string;
}
