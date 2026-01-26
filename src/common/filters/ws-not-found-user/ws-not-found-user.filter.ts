import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { SocketAuth } from 'src/auth/interfaces/socket-user.interface';
import { WsNotFoundUserException } from 'src/common/exceptions/ws-not-found-user.exception';
import { PlayEventsEnum } from 'src/play/enums/play-events.enum';

@Catch(WsNotFoundUserException)
export class WsNotFoundUserFilter implements ExceptionFilter {
  catch(exception: WsNotFoundUserException, host: ArgumentsHost) {
    const client = host.switchToWs().getClient<SocketAuth>();

    const error = exception.getError();

    client.emit(PlayEventsEnum.PLAY_MESSAGE, error);

    client.disconnect();
  }
}
