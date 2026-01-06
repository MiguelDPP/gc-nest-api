import { Expose } from 'class-transformer';

export class AnswerResponseDto {
  @Expose()
  id: string;
  @Expose()
  response: string;
  @Expose()
  isCorrect: boolean;
}
