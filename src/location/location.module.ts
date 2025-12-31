import { Module } from '@nestjs/common';
import { LocationService } from './location.service';
import { LocationController } from './location.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Department } from './entities/department.entity';
import { Municipality } from './entities/municipality.entity';

@Module({
  controllers: [LocationController],
  providers: [LocationService],
  imports: [TypeOrmModule.forFeature([Department, Municipality])],
  exports: [TypeOrmModule, LocationService],
})
export class LocationModule {}
