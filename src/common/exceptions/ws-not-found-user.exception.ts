import { WsException } from '@nestjs/websockets';

export class WsNotFoundUserException extends WsException {
  constructor(message?: string | object) {
    super(message || 'Usuario no encontrado');
  }
}
