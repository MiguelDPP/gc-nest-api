import { Controller, Get } from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { TypeQuestionsService } from '../services/type-questions.service';

@Controller('type-questions')
export class TypeQuestionsController {
  constructor(private readonly typeQuestionsService: TypeQuestionsService) {}

  @Auth()
  @Get()
  getTypeQuestions() {
    return this.typeQuestionsService.findAll();
  }
}
