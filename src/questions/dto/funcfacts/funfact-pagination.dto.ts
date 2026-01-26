import { IntersectionType } from '@nestjs/swagger';
import { PaginationDto } from 'src/common/dto/pagination.dto';

export class FunFactPaginationDto extends IntersectionType(PaginationDto) {}
