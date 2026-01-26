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
import { LocationModule } from 'src/location/location.module';
import { TypeQuestionsService } from './services/type-questions.service';
import { TypeQuestionsController } from './controllers/type-questions.controller';
import { FunFacts } from './entities/fun-facts.entity';
import { LabelsQuestionsRelationship } from './entities/labels-questions-relationship.entity';
import { UsersModule } from 'src/users/users.module';
import { FunfactsController } from './controllers/funfacts.controller';
import { FunfactsService } from './services/funfacts.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TypeQuestion,
      Question,
      Answer,
      Label,
      FunFacts,
      LabelsQuestionsRelationship,
    ]),
    LocationModule,
    UsersModule,
  ],
  controllers: [
    QuestionsController,
    LabelsController,
    TypeQuestionsController,
    FunfactsController,
  ],
  providers: [
    QuestionsService,
    LabelsService,
    TypeQuestionsService,
    FunfactsService,
  ],
  exports: [TypeQuestionsService, TypeOrmModule],
})
export class QuestionsModule {}
