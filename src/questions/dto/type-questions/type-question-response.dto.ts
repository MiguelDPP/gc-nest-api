import { Expose } from 'class-transformer';
import { TypeQuestionsEnum } from 'src/questions/enums/typeQuestions.enum';

export class TypeQuestionResponseDto {
  @Expose()
  id: string;
  @Expose()
  name: TypeQuestionsEnum;
}
