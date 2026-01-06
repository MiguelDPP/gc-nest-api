import { plainToInstance } from 'class-transformer';
import { QuestionResponseDto } from '../dto/questions/question-response.dto';
import { Question } from '../entities/question.entity';
import { UserMapper } from 'src/users/mappers/user.mapper';

export class QuestionMapper {
  static toResponse(question: Question): QuestionResponseDto {
    const questionDto = plainToInstance(QuestionResponseDto, question, {
      excludeExtraneousValues: true,
    });

    if (question.user) {
      questionDto.user = UserMapper.toResponse(question.user);
    }

    return questionDto;
  }

  static toResponseList(questions: Question[]): QuestionResponseDto[] {
    return questions.map((question) => QuestionMapper.toResponse(question));
  }
}
