import { Expose } from 'class-transformer';

export class LabelResponseDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  color: string;
}
