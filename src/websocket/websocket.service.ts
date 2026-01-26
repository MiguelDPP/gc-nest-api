import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { SocketAuth } from 'src/auth/interfaces/socket-user.interface';

interface UserSocket {
  socket: SocketAuth;
  userId: string;
}

@Injectable()
export class WebsocketService {
  private clients = new Map<string, UserSocket>(); // key = socketId

  register(socket: Socket, userId: string) {
    this.clients.set(socket.id, { socket, userId });
  }

  remove(socketId: string) {
    this.clients.delete(socketId);
  }

  getUserSockets(userId: string): Socket[] {
    return [...this.clients.values()]
      .filter((c) => c.userId === userId)
      .map((c) => c.socket);
  }

  isUserConnected(userId: string): boolean {
    return [...this.clients.values()].some((c) => c.userId === userId);
  }

  getClientBySocketId(socketId: string): SocketAuth | null {
    const client = this.clients.get(socketId);
    return client ? client.socket : null;
  }
}
