import { IntersectionType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginationDto } from 'src/common/dto/pagination.dto';

export class LabelPaginationDto extends IntersectionType(PaginationDto) {
  @IsString()
  @IsOptional()
  name: string;
}
