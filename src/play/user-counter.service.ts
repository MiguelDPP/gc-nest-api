import { Injectable } from '@nestjs/common';

interface UserCountdown {
  userId: string;
  socketId: string;
  remaining: number; // segundos
  interval: NodeJS.Timeout;
}

@Injectable()
export class UserCounterService {
  private timers = new Map<string, UserCountdown>();

  start(
    userId: string,
    socketId: string,
    seconds: number,
    onFinish: (socketId: string) => Promise<void>,
    onEmit: (remaining: number, socketId: string) => void,
  ) {
    if (this.timers.has(userId)) return;

    let remaining = seconds;

    const interval = setInterval(() => {
      remaining--;
      const updatedSocketId = this.getSocketIdByUserId(userId);

      onEmit(remaining, updatedSocketId!);

      if (remaining <= 0) {
        this.stop(userId);
        void onFinish(updatedSocketId!);
      }
    }, 1000);

    this.timers.set(userId, { userId, remaining, interval, socketId });
  }

  stop(userId: string) {
    const timer = this.timers.get(userId);
    if (!timer) return;

    clearInterval(timer.interval);
    this.timers.delete(userId);
  }

  getRemaining(userId: string): number {
    return this.timers.get(userId)?.remaining ?? 0;
  }

  getSocketIdByUserId(userId: string): string | null {
    return this.timers.get(userId)?.socketId || null;
  }

  updateSocketId(userId: string, socketId: string) {
    const timer = this.timers.get(userId);
    if (!timer) return;

    timer.socketId = socketId;
    this.timers.set(userId, timer);
  }
}
