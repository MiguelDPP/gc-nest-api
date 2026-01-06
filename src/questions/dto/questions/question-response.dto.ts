import { Expose } from 'class-transformer';
import { UserResponseDto } from 'src/users/dto/user-response.dto';

export class QuestionResponseDto {
  @Expose()
  id: string;
  @Expose()
  questionTitle: string;
  @Expose()
  question: string;
  @Expose()
  user?: UserResponseDto;
  @Expose()
  typeQuestion: {
    id: string;
    name: string;
  };
  @Expose()
  time: number;

  @Expose()
  isValidated: boolean;
  @Expose()
  points: number;
  @Expose()
  municipality?: {
    id: number;
    name: string;
  };
}
