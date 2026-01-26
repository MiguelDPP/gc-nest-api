import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { JwtPayload } from '../interfaces';
import { SocketAuth } from '../interfaces/socket-user.interface';

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  emitErrors(client: SocketAuth, message: string) {
    client.emit('errors', message);
  }

  canActivate(context: ExecutionContext): boolean {
    const client: SocketAuth = context.switchToWs().getClient<SocketAuth>();

    const token = (client.handshake.auth?.token ||
      client.handshake.headers?.authentication) as string;

    if (!token) {
      this.emitErrors(client, 'Token not provided');
      client.disconnect();

      return false;
    }

    try {
      const payload: JwtPayload = this.jwtService.verify(token);
      client.data.user = payload;
      return true;
    } catch {
      //Dar feedback al cliente
      this.emitErrors(client, 'Invalid token');
      client.disconnect();
      return false;
    }
  }
}
