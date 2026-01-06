import { IntersectionType } from '@nestjs/swagger';
import { PaginationDto } from 'src/common/dto/pagination.dto';

export class CommentPaginationDto extends IntersectionType(PaginationDto) {}
