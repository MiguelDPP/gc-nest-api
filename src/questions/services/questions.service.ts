import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateQuestionDto } from '../dto/questions/create-question.dto';
import { UpdateQuestionDto } from '../dto/questions/update-question.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Question } from '../entities/question.entity';
import { Repository } from 'typeorm';
import { LocationService } from 'src/location/location.service';
import { QuestionResponseDto } from '../dto/questions/question-response.dto';
import { QuestionMapper } from '../mappers/question.mapper';
import { TypeQuestionsService } from './type-questions.service';
import { User } from 'src/users/entities/user.entity';
import { CreateAnswerDto } from '../dto/answers/create-answer.dto';
import { TypeQuestionsEnum } from '../enums/typeQuestions.enum';
import { Answer } from '../entities/answer.entity';
import { LabelsService } from './labels.service';
import { LabelsQuestionsRelationship } from '../entities/labels-questions-relationship.entity';
import { UsersService } from 'src/users/users.service';
import { FunFacts } from '../entities/fun-facts.entity';
import { QuestionPaginationDto } from '../dto/questions/question-pagination.dto';
import { getPageAndTotalPages } from 'src/common/helpers/pagination.helper';
import { PaginationResponseDto } from 'src/common/dto/pagination-response.dto';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(Question)
    private readonly questionRespository: Repository<Question>,

    @InjectRepository(Answer)
    private readonly answerRepository: Repository<Answer>,

    @InjectRepository(LabelsQuestionsRelationship)
    private readonly labelsQuestionsRelationshipRepository: Repository<LabelsQuestionsRelationship>,

    @InjectRepository(FunFacts)
    private readonly funFactsRepository: Repository<FunFacts>,

    private readonly locationService: LocationService,
    private readonly typeQuestionService: TypeQuestionsService,
    private readonly labelService: LabelsService,
    private readonly userService: UsersService,
  ) {}

  private answersFiltered(
    answers: CreateAnswerDto[],
    questionType: TypeQuestionsEnum,
  ) {
    const lenghtAnswers = answers.length;
    const correctAnswers = answers.filter((answer) => answer.isCorrect);

    switch (questionType) {
      case TypeQuestionsEnum.SELECCION_MULTIPLE:
        if (
          lenghtAnswers < 2 ||
          correctAnswers.length < 1 ||
          lenghtAnswers > 4
        ) {
          throw new BadRequestException(
            'Las preguntas de selección múltiple deben tener al menos dos respuestas y una correcta y como máximo 4 respuestas.',
          );
        }
        break;
      case TypeQuestionsEnum.VERDADERO_FALSO:
        if (lenghtAnswers !== 2 || correctAnswers.length !== 1) {
          throw new BadRequestException(
            'Las preguntas de verdadero/falso deben tener exactamente dos respuestas y una correcta.',
          );
        }
        break;
      case TypeQuestionsEnum.RESPUESTA_UNICA:
        if (
          lenghtAnswers < 2 ||
          correctAnswers.length !== 1 ||
          lenghtAnswers > 4
        ) {
          throw new BadRequestException(
            'Las preguntas de respuesta única deben tener al menos dos respuestas y una correcta y como máximo 4 respuestas.',
          );
        }
    }
  }

  private prepareAnswers(answers: CreateAnswerDto[]) {
    return answers.map((answerDto) => this.answerRepository.create(answerDto));
  }

  private async verifyLabels(labels: string[]) {
    const preparedLabels = await this.labelService.findByIds(labels);
    return preparedLabels.map((label) => {
      const relationship = this.labelsQuestionsRelationshipRepository.create({
        label: label,
      });
      return relationship;
    });
  }

  private prepareFunFact(funFact?: string, funFactTitle?: string) {
    return this.funFactsRepository.create({
      title: funFactTitle,
      content: funFact,
    });
  }

  async create(
    createQuestionDto: CreateQuestionDto,
    user: User,
  ): Promise<QuestionResponseDto> {
    const { answers, labels, municipalityId, funFact, funFactTitle, ...rest } =
      createQuestionDto;

    const typeQuestion = await this.typeQuestionService.findOne(
      rest.typeQuestionId,
    );
    this.answersFiltered(answers, typeQuestion.name);

    const preparedAnswers = this.prepareAnswers(answers);

    const question = this.questionRespository.create({
      ...rest,
      typeQuestion: typeQuestion,
      answers: preparedAnswers,
      funFacts: [],
    });

    if (!funFact || !funFactTitle) {
      question.funFacts = [this.prepareFunFact(funFact, funFactTitle)];
    }

    if (labels && labels.length > 0) {
      question.labels = await this.verifyLabels(labels);
    }

    if (municipalityId) {
      question.municipality =
        await this.locationService.findMunicipalityById(municipalityId);
    }
    question.isValidated = this.userService.isAdmin(user);
    question.user = user;

    return QuestionMapper.toResponse(
      await this.questionRespository.save(question),
    );
  }

  // TODO: ANALIZAR BIEN ESTA PORQUE NO ESTOY SEGURO, REVISAR COMO LA UTILIZA EL FRONT
  async findAll(
    questionPaginationDto: QuestionPaginationDto,
    user: User,
  ): Promise<PaginationResponseDto<QuestionResponseDto>> {
    const { limit = 10, offset = 0, isValidated } = questionPaginationDto;

    const queryBuilder = this.questionRespository
      .createQueryBuilder('question')
      .leftJoinAndSelect('question.answers', 'answers')
      .leftJoinAndSelect('question.typeQuestion', 'typeQuestion')
      .leftJoinAndSelect('question.municipality', 'municipality')
      .leftJoinAndSelect('question.labels', 'labels')
      .leftJoinAndSelect('question.user', 'user');

    if (this.userService.isAdmin(user) && isValidated !== undefined) {
      queryBuilder.where('question.isValidated = :isValidated', {
        isValidated,
      });
    }

    queryBuilder.skip(offset).take(limit);

    const [questions, total] = await queryBuilder.getManyAndCount();

    const [page, totalPages] = getPageAndTotalPages(limit, offset, total);

    return {
      page,
      totalPages,
      total,
      data: QuestionMapper.toResponseList(questions),
    };
  }

  async findOne(id: string, user: User): Promise<QuestionResponseDto> {
    const question = await this.questionRespository.findOne({
      where: { id },
      relations: ['answers', 'typeQuestion', 'municipality', 'labels'],
    });

    if (
      !question ||
      question.user.id !== user.id ||
      !this.userService.isAdmin(user)
    ) {
      throw new NotFoundException(`Question with id ${id} not found`);
    }

    return QuestionMapper.toResponse(question);
  }

  update(id: number, updateQuestionDto: UpdateQuestionDto) {
    return `This action updates a #${id} question`;
  }

  remove(id: number) {
    return `This action removes a #${id} question`;
  }
}
