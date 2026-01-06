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
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string, @GetUser() user: User) {
    return this.questionsService.findOne(id, user);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateQuestionDto: UpdateQuestionDto,
  ) {
    return this.questionsService.update(+id, updateQuestionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.questionsService.remove(+id);
  }
}
