import { plainToInstance } from 'class-transformer';
import { AnswerResponseDto } from '../dto/answers/asnwer-response.dto';
import { Answer } from '../entities/answer.entity';

export class AnswerMapper {
  static toResponse(answer: Answer): AnswerResponseDto {
    const answerDto = plainToInstance(AnswerResponseDto, answer, {
      excludeExtraneousValues: true,
    });

    return answerDto;
  }

  static toResponseList(answers: Answer[]): AnswerResponseDto[] {
    return answers.map((answer) => AnswerMapper.toResponse(answer));
  }
}
