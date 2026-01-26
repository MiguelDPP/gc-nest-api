import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FunFacts } from '../entities/fun-facts.entity';
import { Repository } from 'typeorm';
import { FunFactPaginationDto } from '../dto/funcfacts/funfact-pagination.dto';
import { PaginationResponseDto } from 'src/common/dto/pagination-response.dto';
import { FunfactResponseDto } from '../dto/funcfacts/funfact-response.dto';
import { FunFactMapper } from '../mappers/funfact.mapper';
import { getPageAndTotalPages } from 'src/common/helpers/pagination.helper';

@Injectable()
export class FunfactsService {
  constructor(
    @InjectRepository(FunFacts)
    private readonly funFactsRepository: Repository<FunFacts>,
  ) {}

  async getFunfactsMessage(
    funfactPagination: FunFactPaginationDto,
  ): Promise<PaginationResponseDto<FunfactResponseDto>> {
    const { offset = 0, limit = 10 } = funfactPagination;

    const [funFacts, total] = await this.funFactsRepository.findAndCount({
      skip: offset,
      take: limit,
      order: {
        createdAt: 'DESC',
      },
    });

    const [page, totalPages] = getPageAndTotalPages(limit, offset, total);

    const funFactResponses = FunFactMapper.toResponseDtoList(funFacts);
    return {
      total,
      page,
      totalPages,
      data: funFactResponses,
    };
  }
}
