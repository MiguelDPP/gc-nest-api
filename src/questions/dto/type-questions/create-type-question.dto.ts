import { IsString, MinLength } from 'class-validator';
import { TypeQuestionsEnum } from 'src/questions/enums/typeQuestions.enum';

export class CreateTypeQuestionDto {
  @IsString()
  @MinLength(3)
  name: TypeQuestionsEnum;
}
