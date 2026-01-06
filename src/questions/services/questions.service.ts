import { Injectable } from '@nestjs/common';
import { CreateQuestionDto } from '../dto/questions/create-question.dto';
import { UpdateQuestionDto } from '../dto/questions/update-question.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Question } from '../entities/question.entity';
import { Repository } from 'typeorm';
import { LocationService } from 'src/location/location.service';
import { QuestionResponseDto } from '../dto/questions/question-response.dto';
import { QuestionMapper } from '../mappers/question.mapper';
import { TypeQuestionsService } from './type-questions.service';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(Question)
    private readonly questionRespository: Repository<Question>,

    private readonly locationService: LocationService,
    private readonly typeQuestionService: TypeQuestionsService,
  ) {}

  async create(
    createQuestionDto: CreateQuestionDto,
  ): Promise<QuestionResponseDto> {
    const { answers, labels, municipalityId, ...rest } = createQuestionDto;

    const typeQuestion = await this.typeQuestionService.findOne(
      rest.typeQuestionId,
    );

    const question = this.questionRespository.create({
      ...rest,
      typeQuestion: typeQuestion,
    });
    if (municipalityId) {
      const municipality =
        await this.locationService.findMunicipalityById(municipalityId);

      question.municipality = municipality;
    }

    await this.questionRespository.save(question);

    // TODO: Labels, answers, funfact

    return QuestionMapper.toResponse(question);
  }

  findAll() {
    return `This action returns all questions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} question`;
  }

  update(id: number, updateQuestionDto: UpdateQuestionDto) {
    return `This action updates a #${id} question`;
  }

  remove(id: number) {
    return `This action removes a #${id} question`;
  }
}
