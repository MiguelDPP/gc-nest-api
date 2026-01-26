import { plainToInstance } from 'class-transformer';
import { AnswerResponseDto } from '../dto/answers/asnwer-response.dto';
import { Answer } from '../entities/answer.entity';
import { AnswerPrivateResponseDto } from '../dto/answers/asnwer-private-response.dto';

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

  static toPrivateResponse(answer: Answer): AnswerPrivateResponseDto {
    const answerDto = plainToInstance(AnswerPrivateResponseDto, answer, {
      excludeExtraneousValues: true,
    });

    return answerDto;
  }

  static toPrivateResponseList(answers: Answer[]): AnswerPrivateResponseDto[] {
    return answers.map((answer) => AnswerMapper.toPrivateResponse(answer));
  }
}
