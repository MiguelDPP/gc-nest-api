import { TypeQuestionResponseDto } from '../dto/type-questions/type-question-response.dto';
import { TypeQuestion } from '../entities/type-questions.entity';
import { plainToInstance } from 'class-transformer';

export class TypeQuestionMapper {
  static toResponse(typeQuestion: TypeQuestion): TypeQuestionResponseDto {
    const typeQuestionDto = plainToInstance(
      TypeQuestionResponseDto,
      typeQuestion,
      {
        excludeExtraneousValues: true,
      },
    );

    return typeQuestionDto;
  }

  static toResponseList(
    typeQuestions: TypeQuestion[],
  ): TypeQuestionResponseDto[] {
    return typeQuestions.map((typeQuestion) =>
      TypeQuestionMapper.toResponse(typeQuestion),
    );
  }
}
