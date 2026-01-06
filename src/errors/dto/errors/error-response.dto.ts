import { Expose } from 'class-transformer';
import { UserResponseDto } from 'src/users/dto/user-response.dto';
import { CommentResponseDto } from '../comments/comment-response.dto';

export class ErrorResponseDto {
  @Expose()
  id: string;
  @Expose()
  title: string;
  @Expose()
  description: string;
  @Expose()
  url?: string;
  @Expose()
  isResolved: boolean;
  @Expose()
  comments?: CommentResponseDto[];

  @Expose()
  user?: UserResponseDto;
}
