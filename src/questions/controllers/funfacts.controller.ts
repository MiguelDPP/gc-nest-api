import { Controller, Get, Query } from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { FunFactPaginationDto } from '../dto/funcfacts/funfact-pagination.dto';
import { FunfactsService } from '../services/funfacts.service';

@Controller('funfacts')
export class FunfactsController {
  constructor(private readonly funfactsService: FunfactsService) {}

  @Auth()
  @Get()
  getFunfacts(@Query() funfactPagination: FunFactPaginationDto) {
    return this.funfactsService.getFunfactsMessage(funfactPagination);
  }
}
