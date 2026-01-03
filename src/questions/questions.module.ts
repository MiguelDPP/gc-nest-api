import { Module } from '@nestjs/common';
import { QuestionsService } from './services/questions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeQuestion } from './entities/type-questions.entity';
import { Question } from './entities/question.entity';
import { Answer } from './entities/answer.entity';
import { Label } from './entities/label.entity';
import { QuestionsController } from './controllers/questions.controller';
import { LabelsController } from './controllers/labels.controller';
import { LabelsService } from './services/labels.service';

@Module({
  imports: [TypeOrmModule.forFeature([TypeQuestion, Question, Answer, Label])],
  controllers: [QuestionsController, LabelsController],
  providers: [QuestionsService, LabelsService],
})
export class QuestionsModule {}
