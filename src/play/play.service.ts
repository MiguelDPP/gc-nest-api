import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { WebsocketService } from 'src/websocket/websocket.service';
import { Score } from './entities/score.entity';
import { Repository } from 'typeorm';
import { SocketAuth } from 'src/auth/interfaces/socket-user.interface';
import { ScoreQuestions } from './entities/score-questions.entity';
import { Question } from 'src/questions/entities/question.entity';
import { User } from 'src/users/entities/user.entity';
import { UserCounterService } from './user-counter.service';
import { PlayMessage } from './interfaces/play-message.interface';
import { PlayEventsEnum } from './enums/play-events.enum';
import { Server } from 'socket.io';
import { WebSocketServer, WsException } from '@nestjs/websockets';
import { QuestionMapper } from 'src/questions/mappers/question.mapper';
import { SubmitAnswerDto } from './dto/submit-answer.dto';
import { Answer } from 'src/questions/entities/answer.entity';

@Injectable()
export class PlayService {
  @WebSocketServer() ws: Server;
  constructor(
    private readonly usersService: UsersService,
    private readonly webSocketService: WebsocketService,

    @InjectRepository(Score)
    private readonly scoreRepository: Repository<Score>,

    @InjectRepository(ScoreQuestions)
    private readonly scoreQuestionRepository: Repository<ScoreQuestions>,

    // TODO: LLEVARLO AL SERVICE DE QUESTIONS
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,

    private readonly userCounterService: UserCounterService,
  ) {}

  async createScore(client: SocketAuth) {
    const user = (await this.usersService.findFullWithId(
      client.data.user!.id,
    )) as User;

    const socketId = this.userCounterService.getSocketIdByUserId(user.id);

    if (!socketId) {
      const score = this.scoreRepository.create({ user, totalQuestions: 0 });

      const question = await this.createQuestionForScore(score);

      if (!question) {
        this.emitMessageToUser(client.id, {
          message: 'No hay más preguntas disponibles.',
          type: 'success',
        });
        return;
      }

      score.scoreQuestions = [question[1]];

      // await this.scoreRepository.save(score);
      this.seendCuestion(question[0], client, score.id);
      this.startTime(client, question[0].time, score);
    } else {
      if (socketId !== client.id) {
        const score = await this.getCurrentScoreForUser(user.id);
        const question = await this.getCurrentQuestionForScore(score!);
        if (question) {
          this.emitMessageToUser(socketId, {
            message:
              'Has iniciado sesión en otro dispositivo, si no fuiste tú, contacta con soporte. Tu partida seguirá en el nuevo dispositivo.',
            type: 'warning',
          });
          this.userCounterService.updateSocketId(user.id, client.id);
          this.seendCuestion(question, client, score!.id);
        } else {
          this.userCounterService.stop(user.id);
        }
      }
    }
  }

  async getCurrentScoreForUser(userId: string) {
    return this.scoreRepository.findOne({
      where: { user: { id: userId }, isFinished: false },
      relations: { scoreQuestions: { question: true } },
      order: { createdAt: 'DESC' },
    });
  }

  async getCurrentQuestionForScore(score: Score) {
    const question = score.scoreQuestions.find((sq) => {
      return sq.answer === null;
    });
    if (!question) return null;

    const questionWithAnswer = await this.questionRepository
      .createQueryBuilder('question')
      .leftJoinAndSelect('question.answers', 'answer')
      //Quitar un campo innecesario
      .leftJoinAndSelect('question.typeQuestion', 'typeQuestion')
      .where('question.id = :id', { id: question.question.id })
      .getOne();
    return questionWithAnswer;
  }

  seendCuestion(question: Question, client: SocketAuth, scoreId: string) {
    const questionDto = QuestionMapper.toResponse(question, true);

    // Eliminar datos que no se deben enviar al cliente

    client.emit(PlayEventsEnum.PLAY_QUESTION, {
      type: 'success',
      message: {
        question: questionDto,
        scoreId: scoreId,
      },
    } as PlayMessage);
  }

  startTime(client: SocketAuth, seconds: number, score: Score) {
    const userId = client.data.user!.id;

    // Verificar si ya hay un contador activo para este usuario
    this.userCounterService.stop(userId);

    this.userCounterService.start(
      userId,
      client.id,
      seconds,
      async (socketId: string) => {
        this.emitMessageToUser(socketId, {
          message: 'El tiempo ha terminado.',
          type: 'info',
        });

        await this.finishScore(score, socketId);
      },
      (remaining: number, socketId: string) => {
        this.emitCounterToUser(socketId, remaining);
      },
    );
  }

  emitFinishToUser(clientId: string) {
    const client = this.webSocketService.getClientBySocketId(clientId);
    if (!client) return;
    client.emit(PlayEventsEnum.PLAY_FINISH, {
      message: 'La partida ha finalizado.',
      type: 'info',
    } as PlayMessage);
  }

  async finishScore(score: Score, socketId: string) {
    score.isFinished = true;
    this.emitFinishToUser(socketId);
    await this.scoreRepository.save(score);
  }

  // async asignQuestionToScore(score: Score, client: SocketAuth) {}

  emitMessageToUser(clientId: string, message: PlayMessage) {
    const client = this.webSocketService.getClientBySocketId(clientId);
    if (!client) return;
    client.emit(PlayEventsEnum.PLAY_MESSAGE, message);
  }

  emitCounterToUser(socketId: string, seconds: number) {
    const client = this.webSocketService.getClientBySocketId(socketId);
    if (!client) return;
    client.emit(PlayEventsEnum.PLAY_COUNTER, { seconds });
  }

  async submitAnswer(client: SocketAuth, submitAnswerDto: SubmitAnswerDto) {
    const { answerId, questionId, scoreId } = submitAnswerDto;

    const userId = client.data.user!.id;

    const socketId = this.userCounterService.getSocketIdByUserId(userId);

    if (!socketId || socketId !== client.id) {
      throw new WsException({
        type: 'error',
        message: 'No hay una partida activa para este usuario.',
      });
    }

    const score = await this.getCurrentScoreForUser(userId);

    if (!score) {
      throw new WsException({
        type: 'error',
        message: 'No hay una partida activa para este usuario.',
      });
    }

    if (score.id !== scoreId) {
      throw new WsException({
        type: 'error',
        message: 'El scoreId no coincide con la partida activa.',
      });
    }

    const question = await this.getCurrentQuestionForScore(score);

    if (!question || question.id !== questionId) {
      throw new WsException({
        type: 'error',
        message: 'La pregunta no coincide con la partida activa.',
      });
    }

    const answers = question.answers;
    const answersRecived = answerId.map((id) => {
      return answers.find((a) => a.id === id);
    }) as Answer[];

    if (!answersRecived || answersRecived.length === 0) {
      throw new WsException({
        type: 'error',
        message: 'No se han encontrado respuestas válidas.',
      });
    }

    const isCorrect = this.validateAnswer(answersRecived, answers);

    if (!isCorrect) {
      await this.changeScoreQuestionWithAnswer(score, question, false);
      await this.finishGame(client, score);
      return;
    }

    await this.changeScoreQuestionWithAnswer(score, question, true);

    const newQuestion = await this.createQuestionForScore(score);

    if (!newQuestion) {
      await this.finishGame(client, score);
      return;
    }

    this.seendCuestion(newQuestion[0], client, score.id);
    this.startTime(client, newQuestion[0].time, score);

    // Aquí puedes continuar con la lógica para procesar la respuesta enviada
  }

  emitPointsToUser(
    clientId: string,
    points: number,
    questionsAnswered: number,
  ) {
    const client = this.webSocketService.getClientBySocketId(clientId);
    if (!client) return;
    client.emit(PlayEventsEnum.PLAY_POINTS, {
      points,
      questionsAnswered,
    });
  }

  async changeScoreQuestionWithAnswer(
    score: Score,
    question: Question,
    answerValue: boolean,
  ) {
    const scoreQuestion = await this.scoreQuestionRepository.findOne({
      where: {
        score: { id: score.id },
        question: { id: question.id },
      },
    });

    if (!scoreQuestion) return;

    if (answerValue) {
      score.totalPoints += question.points;
      await this.scoreRepository.save(score);
    }

    scoreQuestion.answer = answerValue;

    await this.scoreQuestionRepository.save(scoreQuestion);
  }

  async finishGame(client: SocketAuth, score: Score) {
    this.userCounterService.stop(client.data.user!.id);
    await this.finishScore(score, client.id);
  }

  private validateAnswer(answersRecived: Answer[], answers: Answer[]) {
    let isCorrectOne = false;
    for (const answer of answers) {
      const isSelected = answersRecived.some((a) => a.id === answer.id);
      if (
        answer.isCorrect !== isSelected ||
        (!answer.isCorrect && isSelected)
      ) {
        return false;
      }
      if (answer.isCorrect && isSelected) {
        isCorrectOne = true;
      }
    }
    return isCorrectOne;
    // switch (questionType) {
    //   case TypeQuestionsEnum.SELECCION_MULTIPLE:
    //     return true;
    //   case TypeQuestionsEnum.VERDADERO_FALSO:
    //     for (const answer of answers) {
    //       const isSelected = answersRecived.some((a) => a.id === answer.id);
    //       if (answer.isCorrect !== isSelected) {
    //         return false;
    //       }
    //     }
    //     return true;
    //   case TypeQuestionsEnum.RESPUESTA_UNICA:
    //     for (const answer of answers) {
    //       const isSelected = answersRecived.some((a) => a.id === answer.id);
    //       if (answer.isCorrect !== isSelected) {
    //         return false;
    //       }
    //     }
    //     return true;
    //   default:
    //     break;
    // }
  }

  async createQuestionForScore(
    score: Score,
  ): Promise<[Question, ScoreQuestions] | null> {
    // Traer una pregunta aleatoria que no se encuentre ya en scoreQuestions
    const usedQuestionIds =
      score.scoreQuestions?.map((sq) => sq.question.id) || [];

    const queryBuilder = this.questionRepository
      .createQueryBuilder('question')
      .leftJoinAndSelect('question.answers', 'answer')
      .leftJoinAndSelect('question.typeQuestion', 'typeQuestion')
      .orderBy('RANDOM()');

    if (usedQuestionIds.length > 0) {
      queryBuilder.where('question.id NOT IN (:...ids)', {
        ids: usedQuestionIds,
      });
    }

    const question = await queryBuilder.getOne();

    if (!question) {
      return null;
    }

    const scoreQuestion = this.scoreQuestionRepository.create({
      score,
      question,
    });
    await this.scoreQuestionRepository.save(scoreQuestion);
    score.totalQuestions += 1;
    await this.scoreRepository.save(score);
    return [question, scoreQuestion];
  }
}

// @SubscribeMessage('startQuestion')
// startQuestion(@ConnectedSocket() client: SocketAuth) {
//   const userId = client.data.userId;

//   this.countdownService.start(userId, 30, () => {
//     client.emit('timeUp');
//   });

//   const emitInterval = setInterval(() => {
//     const remaining = this.countdownService.getRemaining(userId);
//     client.emit('tick', remaining);

//     if (remaining <= 0) clearInterval(emitInterval);
//   }, 1000);
// }
