import { IntersectionType } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from 'src/common/dto/pagination.dto';

type RoleDefinition = 'user' | 'admin' | 'all';

export class UserPaginationDto extends IntersectionType(PaginationDto) {
  @IsOptional()
  @IsString()
  @IsIn(['user', 'admin', 'all'])
  rol?: RoleDefinition;
}
