import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator';

export class CreateAnswerDto {
  @IsString()
  @MinLength(3)
  response: string;

  @IsOptional()
  @IsUUID()
  questionId: string;

  @IsOptional()
  @IsBoolean()
  // @Type(() => Boolean)
  @Transform(({ value }) => Boolean(value ?? true)) // Todo: probar esto
  isCorrect: boolean;
}
