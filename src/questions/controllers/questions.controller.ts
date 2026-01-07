import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Query,
  ParseBoolPipe,
} from '@nestjs/common';
import { QuestionsService } from '../services/questions.service';
import { CreateQuestionDto } from '../dto/questions/create-question.dto';
import { UpdateQuestionDto } from '../dto/questions/update-question.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { QuestionPaginationDto } from '../dto/questions/question-pagination.dto';

@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Auth()
  @Post()
  create(@Body() createQuestionDto: CreateQuestionDto, @GetUser() user: User) {
    return this.questionsService.create(createQuestionDto, user);
  }

  @Auth()
  @Get()
  findAll(
    @Query() questionPaginationDto: QuestionPaginationDto,
    @GetUser() user: User,
  ) {
    return this.questionsService.findAll(questionPaginationDto, user);
  }

  @Auth()
  @Get('my')
  findMyQuestions(
    @Query() questionPaginationDto: QuestionPaginationDto,
    @GetUser() user: User,
  ) {
    return this.questionsService.findMyQuestions(questionPaginationDto, user);
  }

  @Auth()
  @Post(':questionId/validate')
  validateQuestion(
    @Param('questionId', ParseUUIDPipe) questionId: string,
    @Body('isValidated', ParseBoolPipe) isValidated: boolean,
    @GetUser() user: User,
  ) {
    return this.questionsService.validateQuestion(
      questionId,
      isValidated,
      user,
    );
  }

  @Auth()
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string, @GetUser() user: User) {
    return this.questionsService.findOne(id, user);
  }

  @Auth()
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateQuestionDto: UpdateQuestionDto,
    @GetUser() user: User,
  ) {
    return this.questionsService.update(id, updateQuestionDto, user);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.questionsService.remove(id);
  }
}
