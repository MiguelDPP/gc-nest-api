import {
  WebSocketGateway,
  SubscribeMessage,
  ConnectedSocket,
  WebSocketServer,
  MessageBody,
} from '@nestjs/websockets';
import { PlayService } from './play.service';
import { Server } from 'socket.io';
import { UseFilters, UseGuards } from '@nestjs/common';
import { WsJwtGuard } from 'src/auth/guards/ws-jwt.guard';
import type { SocketAuth } from 'src/auth/interfaces/socket-user.interface';
import { WebsocketService } from 'src/websocket/websocket.service';
import { BaseGateway } from 'src/websocket/base/base.gateway';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { SubmitAnswerDto } from './dto/submit-answer.dto';
import { WsValidationPipe } from 'src/common/pipes/ws-validation.pipe';
import { WsExceptionFilter } from 'src/common/filters/ws-exception/ws-exception.filter';

// @UseFilters(WsNotFoundUserException, WsExceptionFilter)
@UseFilters(WsExceptionFilter)
@UseGuards(WsJwtGuard)
@WebSocketGateway({
  cors: true,
  namespace: 'play',
})
export class PlayGateway extends BaseGateway {
  @WebSocketServer() private readonly ws: Server;
  constructor(
    private readonly playService: PlayService,
    jwtService: JwtService,
    wsService: WebsocketService,
    userService: UsersService,
  ) {
    super(jwtService, wsService, userService);
  }

  // async handleConnection(client: Socket) {
  //   const token = client.handshake.headers.authentication as string;
  //   let payload: JwtPayload;
  //   try {
  //     payload = this.jwtService.verify(token);
  //     await this.playService.registerClient(client, payload.id);
  //   } catch {
  //     client.disconnect();
  //     return;
  //   }
  // }

  // handleDisconnect(client: SocketAuth) {
  //   this.wsService.remove(client.id);
  // }

  @SubscribeMessage('createScore')
  createScore(@ConnectedSocket() client: SocketAuth) {
    return this.playService.createScore(client);
  }

  @SubscribeMessage('sendAnswer')
  submitAnswer(
    @ConnectedSocket() client: SocketAuth,
    // Utilizar un DTO
    @MessageBody(new WsValidationPipe()) submitAnswerDto: SubmitAnswerDto,
  ) {
    return this.playService.submitAnswer(client, submitAnswerDto);
  }
}

// @SubscribeMessage('createPlay')
// create(@MessageBody() createPlayDto: CreatePlayDto) {
//   return this.playService.create(createPlayDto);
// }

// @SubscribeMessage('findAllPlay')
// findAll() {
//   return this.playService.findAll();
// }

// @SubscribeMessage('findOnePlay')
// findOne(@MessageBody() id: number) {
//   return this.playService.findOne(id);
// }

// @SubscribeMessage('updatePlay')
// update(@MessageBody() updatePlayDto: UpdatePlayDto) {
//   return this.playService.update(updatePlayDto.id, updatePlayDto);
// }

// @SubscribeMessage('removePlay')
// remove(@MessageBody() id: number) {
//   return this.playService.remove(id);
// }
// }
