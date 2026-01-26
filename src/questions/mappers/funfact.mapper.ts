import { plainToInstance } from 'class-transformer';
import { FunfactResponseDto } from '../dto/funcfacts/funfact-response.dto';
import { FunFacts } from '../entities/fun-facts.entity';

export class FunFactMapper {
  static toResponseDto(funFact: FunFacts): FunfactResponseDto {
    const funFactResponse = plainToInstance(FunfactResponseDto, funFact, {
      excludeExtraneousValues: true,
    });
    return funFactResponse;
  }

  static toResponseDtoList(funFacts: FunFacts[]): FunfactResponseDto[] {
    return funFacts.map((funFact) => this.toResponseDto(funFact));
  }
}
