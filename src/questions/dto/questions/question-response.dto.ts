import { Expose } from 'class-transformer';
import { UserResponseDto } from 'src/users/dto/user-response.dto';
import { TypeQuestionResponseDto } from '../type-questions/type-question-response.dto';
import { AnswerResponseDto } from '../answers/asnwer-response.dto';
import { LabelResponseDto } from '../labels/label-response.dto';

export class QuestionResponseDto {
  @Expose()
  id: string;
  @Expose()
  questionTitle: string;
  @Expose()
  question: string;
  @Expose()
  user: UserResponseDto;
  @Expose()
  typeQuestion: TypeQuestionResponseDto;
  @Expose()
  time: number;

  @Expose()
  answers: AnswerResponseDto[];

  @Expose()
  isValidated: boolean;
  @Expose()
  points: number;
  @Expose()
  municipality?: {
    id: number;
    name: string;
  };

  @Expose()
  labels: LabelResponseDto[];
}
