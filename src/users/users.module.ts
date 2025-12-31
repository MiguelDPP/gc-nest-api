import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Role } from './entities/role.entity';
import { UsersRolesRelationship } from './entities/users-roles-relationship.entity';
import { LocationModule } from 'src/location/location.module';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [
    TypeOrmModule.forFeature([User, Role, UsersRolesRelationship]),
    LocationModule,
  ],
  exports: [TypeOrmModule, UsersService],
})
export class UsersModule {}
