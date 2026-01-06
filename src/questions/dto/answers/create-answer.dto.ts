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

  @IsBoolean()
  // @Type(() => Boolean)
  @Transform(({ value }: { value: unknown }) => {
    if (value === 'true' || value === true) {
      return true;
    }
    if (value === 'false' || value === false) {
      return false;
    }
    return value;
  }) // Todo: probar esto
  isCorrect: boolean;
}
