import { UserResponseDto } from 'src/users/dto/user-response.dto';
import { ErrorResponseDto } from '../errors/error-response.dto';
import { Expose } from 'class-transformer';

export class CommentResponseDto {
  @Expose()
  id: string;

  @Expose()
  message: string;

  @Expose()
  user: UserResponseDto;

  @Expose()
  error: ErrorResponseDto;

  @Expose()
  createdAt: Date;
}
