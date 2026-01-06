import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { CreateAnswerDto } from '../answers/create-answer.dto';
import { Type } from 'class-transformer';

export class CreateQuestionDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  title?: string;

  @IsOptional()
  @IsString()
  @MinLength(3)
  funFactTitle?: string; // Todo: Unir como se hace con answers

  @IsString()
  @MinLength(3)
  question: string;

  @IsUUID()
  typeQuestionId: string;

  @IsInt()
  @IsPositive()
  time: number;

  @IsOptional()
  @IsInt()
  municipalityId?: number;

  @IsInt()
  @IsPositive()
  points: number;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @ArrayMinSize(2)
  @Type(() => CreateAnswerDto)
  answers: CreateAnswerDto[];

  @IsOptional()
  @IsString()
  @MinLength(3)
  funFact?: string;

  @IsOptional() // Revisar si si o no
  @IsArray({ each: true })
  @IsUUID('all', { each: true })
  labels?: string[];
}
