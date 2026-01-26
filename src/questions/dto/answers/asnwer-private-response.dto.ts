import { Expose } from 'class-transformer';

export class AnswerPrivateResponseDto {
  @Expose()
  id: string;
  @Expose()
  response: string;
}
