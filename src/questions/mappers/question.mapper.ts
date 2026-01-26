import { plainToInstance } from 'class-transformer';
import { QuestionResponseDto } from '../dto/questions/question-response.dto';
import { Question } from '../entities/question.entity';
import { UserMapper } from 'src/users/mappers/user.mapper';
import { TypeQuestionMapper } from './type-question.mapper';
import { AnswerMapper } from './answer.mapper';

export class QuestionMapper {
  static toResponse(
    question: Question,
    isPrivate: boolean = false,
  ): QuestionResponseDto {
    const questionDto = plainToInstance(QuestionResponseDto, question, {
      excludeExtraneousValues: true,
    });

    if (question.user) {
      questionDto.user = UserMapper.toResponse(question.user);
    }

    if (question.municipality) {
      questionDto.municipality = question.municipality;
    }

    if (question.labels) {
      questionDto.labels = question.labels.map((label) => ({
        id: label.label.id,
        name: label.label.name,
        color: label.label.color,
      }));
    }

    questionDto.typeQuestion = TypeQuestionMapper.toResponse(
      question.typeQuestion,
    );

    if (isPrivate) {
      questionDto.answers = AnswerMapper.toPrivateResponseList(
        question.answers,
      );
    } else {
      questionDto.answers = AnswerMapper.toResponseList(question.answers);
    }

    // if ()

    return questionDto;
  }

  static toResponseList(questions: Question[]): QuestionResponseDto[] {
    return questions.map((question) => QuestionMapper.toResponse(question));
  }
}
