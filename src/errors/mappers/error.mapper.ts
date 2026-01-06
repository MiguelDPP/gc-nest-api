import { plainToInstance } from 'class-transformer';
import { UserMapper } from 'src/users/mappers/user.mapper';
import { Error } from '../entities/error.entity';
import { CommentResponseDto, ErrorResponseDto } from '../dto';
import { Comment } from '../entities/comment.entity';

export class ErrorMapper {
  static toErrorResponseDto(error: Error): ErrorResponseDto {
    const dto = plainToInstance(ErrorResponseDto, error, {
      excludeExtraneousValues: true,
    });

    if (error.user) {
      dto.user = UserMapper.toResponse(error.user);
    }

    if (error.comments) {
      dto.comments = this.toCommentResponseDtoList(error.comments);
    }
    return dto;
  }

  static toErrorResponseDtoList(errors: Error[]): ErrorResponseDto[] {
    return errors.map((error) => this.toErrorResponseDto(error));
  }

  static toCommentResponseDto(comment: Comment): CommentResponseDto {
    const dto = plainToInstance(CommentResponseDto, comment, {
      excludeExtraneousValues: true,
    });

    if (comment.user) {
      dto.user = UserMapper.toResponse(comment.user);
    }

    if (comment.error) {
      dto.error = this.toErrorResponseDto(comment.error);
    }
    return dto;
  }

  static toCommentResponseDtoList(comments: Comment[]): CommentResponseDto[] {
    return comments.map((comment) => this.toCommentResponseDto(comment));
  }
}
