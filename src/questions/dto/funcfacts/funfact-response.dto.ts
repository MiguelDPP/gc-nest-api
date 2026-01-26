import { Expose } from 'class-transformer';

export class FunfactResponseDto {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  content: string;
}
