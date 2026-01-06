import { Expose } from 'class-transformer';

export class TypeQuestionResponseDto {
  @Expose()
  id: string;
  @Expose()
  name: string;
}
