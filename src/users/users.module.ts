import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Role } from './entities/role.entity';
import { UsersRolesRelationship } from './entities/users-roles-relationship.entity';
import { LocationModule } from 'src/location/location.module';
// import { AuthModule } from 'src/auth/auth.module';
import { PassportModule } from '@nestjs/passport';
// import { JwtStrategy } from 'src/auth/strategies/jwt.strategy';
// import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [
    TypeOrmModule.forFeature([User, Role, UsersRolesRelationship]),
    LocationModule,
    PassportModule,
    // AuthModule,
  ],
  exports: [TypeOrmModule, UsersService],
})
export class UsersModule {}
