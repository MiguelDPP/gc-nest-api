import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { SocketAuth } from 'src/auth/interfaces/socket-user.interface';
import { PlayEventsEnum } from 'src/play/enums/play-events.enum';

@Catch(WsException)
export class WsExceptionFilter implements ExceptionFilter {
  catch(exception: WsException, host: ArgumentsHost) {
    const client = host.switchToWs().getClient<SocketAuth>();

    const error = exception.getError();

    client.emit(PlayEventsEnum.PLAY_MESSAGE, error);
  }
}
