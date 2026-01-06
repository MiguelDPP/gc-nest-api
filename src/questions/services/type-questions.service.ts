import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeQuestion } from '../entities/type-questions.entity';
import { Repository } from 'typeorm';
import { TypeQuestionResponseDto } from '../dto/type-questions/type-question-response.dto';
import { TypeQuestionMapper } from '../mappers/type-question.mapper';
import { CreateTypeQuestionDto } from '../dto/type-questions/create-type-question.dto';

@Injectable()
export class TypeQuestionsService {
  constructor(
    @InjectRepository(TypeQuestion)
    private readonly typeQuestionRepository: Repository<TypeQuestion>,
  ) {}

  async findAll(): Promise<TypeQuestionResponseDto[]> {
    const typeQuestions = await this.typeQuestionRepository.find();
    return typeQuestions.map((typeQuestion) =>
      TypeQuestionMapper.toResponse(typeQuestion),
    );
  }

  async findOne(id: string): Promise<TypeQuestionResponseDto> {
    const typeQuestion = await this.typeQuestionRepository.findOneBy({ id });

    if (!typeQuestion) {
      throw new Error(`TypeQuestion with id ${id} not found`);
    }

    return TypeQuestionMapper.toResponse(typeQuestion);
  }

  async create(
    createTypeQuestionDto: CreateTypeQuestionDto,
  ): Promise<TypeQuestionResponseDto> {
    const typeQuestion = this.typeQuestionRepository.create({
      ...createTypeQuestionDto,
    });
    await this.typeQuestionRepository.save(typeQuestion);
    return TypeQuestionMapper.toResponse(typeQuestion);
  }

  async deleteAllTypeQuestions(): Promise<void> {
    const queryBuilder = this.typeQuestionRepository.createQueryBuilder();
    await queryBuilder.delete().where({}).execute();
  }

  async createForSeedTypeQuestions(
    typeQuestions: CreateTypeQuestionDto[],
  ): Promise<TypeQuestionResponseDto[]> {
    const createdTypeQuestions: TypeQuestionResponseDto[] = [];
    for (const typeQuestionDto of typeQuestions) {
      const createdTypeQuestion = await this.create(typeQuestionDto);
      createdTypeQuestions.push(createdTypeQuestion);
    }
    return createdTypeQuestions;
  }
}
