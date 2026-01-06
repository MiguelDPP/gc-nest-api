import { IsString, MinLength } from 'class-validator';

export class CreateTypeQuestionDto {
  @IsString()
  @MinLength(3)
  name: string;
}
