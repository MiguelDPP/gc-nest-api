import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { LocationModule } from 'src/location/location.module';
import { UsersModule } from 'src/users/users.module';
import { QuestionsModule } from 'src/questions/questions.module';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [LocationModule, UsersModule, QuestionsModule],
})
export class SeedModule {}
