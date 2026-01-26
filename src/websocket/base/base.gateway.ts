import { JwtService } from '@nestjs/jwt';
import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { SocketAuth } from 'src/auth/interfaces/socket-user.interface';
import { WebsocketService } from '../websocket.service';
import { JwtPayload } from 'src/auth/interfaces';
import { UsersService } from 'src/users/users.service';

export abstract class BaseGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    protected readonly jwtService: JwtService,
    protected readonly wsService: WebsocketService,
    private readonly userService: UsersService,
  ) {}

  async handleConnection(client: SocketAuth) {
    try {
      const token = (client.handshake.auth?.token ||
        client.handshake.headers?.authentication) as string;

      console.log(token);
      if (!token) throw new Error('Token de autenticación no proporcionado.');
      //   {
      //   client.emit(PlayEventsEnum.PLAY_MESSAGE, {
      //     type: 'error',
      //     message: 'Token de autenticación no proporcionado.',
      //   } as PlayMessage);
      //   client.disconnect();
      //   return;
      // }
      // throw new WsNotFoundUserException({
      //   type: 'error',
      //   message: 'Token de autenticación no proporcionado.',
      // } as PlayMessage);

      const payload: JwtPayload = this.jwtService.verify(token);

      const user = await this.userService.findFullWithId(payload.id);

      if (!user || !user.isActive) {
        throw new Error('Usuario no encontrado o inactivo.');
        // client.emit(PlayEventsEnum.PLAY_MESSAGE, {
        //   type: 'error',
        //   message: 'Usuario no encontrado o inactivo.',
        // } as PlayMessage);
        // client.disconnect();
        // return;
      }
      // throw new WsNotFoundUserException({
      //   type: 'error',
      //   message: 'Usuario no encontrado o inactivo.',
      // } as PlayMessage);

      client.data.user = payload;
      this.wsService.register(client, payload.id);
    } catch {
      client.disconnect();
      // throw new Error('Invalid token');
    }
  }

  handleDisconnect(client: SocketAuth) {
    this.wsService.remove(client.id);
  }
}
