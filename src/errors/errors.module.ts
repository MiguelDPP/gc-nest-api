import { Module } from '@nestjs/common';
import { ErrorsService } from './errors.service';
import { ErrorsController } from './errors.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Error } from './entities/error.entity';
import { Comment } from './entities/comment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Error, Comment])],
  controllers: [ErrorsController],
  providers: [ErrorsService],

  exports: [TypeOrmModule],
})
export class ErrorsModule {}
