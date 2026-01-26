import { IsArray, IsUUID } from 'class-validator';

export class SubmitAnswerDto {
  @IsUUID('all', {
    message: 'scoreId debe ser un UUID válido',
  })
  scoreId: string;

  @IsUUID('all', {
    message: 'questionId debe ser un UUID válido',
  })
  questionId: string;

  @IsArray()
  @IsUUID('all', { each: true })
  answerId: string[];
}
