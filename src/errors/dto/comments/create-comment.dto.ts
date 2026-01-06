import { IsString, IsUUID, MinLength } from 'class-validator';

export class CreateCommentDto {
  @IsUUID()
  errorId: string;

  @IsString()
  @MinLength(3)
  message: string;
}
