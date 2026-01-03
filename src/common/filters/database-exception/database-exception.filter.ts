import {
  Catch,
  ConflictException,
  ExceptionFilter,
  InternalServerErrorException,
} from '@nestjs/common';
import { Response } from 'express';
import { QueryFailedError } from 'typeorm';
import type { DatabaseError } from 'pg';

// interface PostgresError {
//   code: string;
//   detail?: string;
//   constraint?: string;
// }

@Catch(QueryFailedError)
export class DatabaseExceptionFilter implements ExceptionFilter {
  catch(exception: QueryFailedError) {
    // const ctx = host.switchToHttp();
    // const response = ctx.getResponse<Response>();

    const error: DatabaseError = exception.driverError as DatabaseError;

    if (error.code === '23505') {
      throw new ConflictException(
        'Propiedades unicas se encuentran en otro registro en la base de datos',
      );
    }

    throw new InternalServerErrorException(error);
  }
}
