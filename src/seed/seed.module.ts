import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { LocationModule } from 'src/location/location.module';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [LocationModule],
})
export class SeedModule {}
