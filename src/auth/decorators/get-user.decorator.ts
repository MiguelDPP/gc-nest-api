import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';
import { Request } from 'express';
import { User } from 'src/users/entities/user.entity';

type RawHeader = keyof User;

export const GetUser = createParamDecorator(
  (data: RawHeader, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest<Request>();
    const user = req.user as User;
    if (!user)
      throw new InternalServerErrorException('User not found (Request)');

    return !data ? user : user[data];
  },
);
