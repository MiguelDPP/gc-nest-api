import { Socket } from 'socket.io';
import { JwtPayload } from './jwt-payload.interface';

export interface SocketAuth extends Socket {
  data: {
    user?: JwtPayload;
  };
}
