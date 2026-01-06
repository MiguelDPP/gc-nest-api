import { plainToInstance } from 'class-transformer';
import { UserResponseDto } from '../dto/user-response.dto';
import { User } from '../entities/user.entity';

export class UserMapper {
  static toResponse(user: User): UserResponseDto {
    const userDto = plainToInstance(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });

    if (user.roles) userDto.roles = user.roles.map((rol) => rol.role.name);
    if (user.municipality) userDto.municipality = user.municipality;

    return userDto;
  }

  static toResponseList(users: User[]): UserResponseDto[] {
    return users.map((user) => UserMapper.toResponse(user));
  }
}
