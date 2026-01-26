import { Module } from '@nestjs/common';
import { PlayService } from './play.service';
import { PlayGateway } from './play.gateway';
import { UsersModule } from 'src/users/users.module';
import { WebsocketModule } from 'src/websocket/websocket.module';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Score } from './entities/score.entity';
import { ScoreQuestions } from './entities/score-questions.entity';
import { UserCounterService } from './user-counter.service';
import { QuestionsModule } from 'src/questions/questions.module';

@Module({
  providers: [PlayGateway, PlayService, UserCounterService],
  imports: [
    TypeOrmModule.forFeature([Score, ScoreQuestions]),
    UsersModule,
    WebsocketModule,
    AuthModule,
    QuestionsModule,
  ],
})
export class PlayModule {}
