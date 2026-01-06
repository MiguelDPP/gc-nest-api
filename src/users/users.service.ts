import { Injectable, NotFoundException } from '@nestjs/common';
import { Role } from './entities/role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { SeedUser } from 'src/seed/interfaces';
import { Municipality } from 'src/location/entities/municipality.entity';
import { UsersRolesRelationship } from './entities/users-roles-relationship.entity';
import * as bcrypt from 'bcrypt';
import { UserResponseDto } from './dto/user-response.dto';
import { UserPaginationDto } from './dto/user-pagination.dto';
import { PaginationResponseDto } from 'src/common/dto/pagination-response.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserMapper } from './mappers/user.mapper';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Municipality)
    private readonly municipalityRepository: Repository<Municipality>,

    @InjectRepository(UsersRolesRelationship)
    private readonly usersRolesRelationshipRepository: Repository<UsersRolesRelationship>,
  ) {}

  async createForSeedRoles(roles: Partial<Role>[]): Promise<Role[]> {
    roles = roles.map((role) => ({
      ...role,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    const newRoles = this.roleRepository.create(roles);
    return this.roleRepository.save(newRoles);
  }

  async deleteAllRoles(): Promise<void> {
    const queryBuilder = this.roleRepository.createQueryBuilder();
    await queryBuilder.delete().where({}).execute();
  }

  async createForSeedUsers(users: SeedUser[]): Promise<User[]> {
    const roles = await this.roleRepository.find();
    const newUsers = users.map((user) => {
      return this.userRepository.create({
        ...user,
        password: bcrypt.hashSync(user.password, 10),
        municipality: this.municipalityRepository.create({
          id: user.municipalityId,
        }),
        roles: user.rolesId.map((roleName) => {
          return this.usersRolesRelationshipRepository.create({
            role: roles.find((role) => role.name === roleName),
            createdAt: new Date(),
          });
        }),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    });
    return this.userRepository.save(newUsers);
  }

  async deleteAllUsers(): Promise<void> {
    const queryBuilderUser = this.userRepository.createQueryBuilder();
    await queryBuilderUser.delete().where({}).execute();
  }

  getCurrentUser(user: User): UserResponseDto {
    return UserMapper.toResponse(user);
  }

  // private toUserResponse(user: User): UserResponseDto {
  //   const userDto = plainToInstance(UserResponseDto, user, {
  //     excludeExtraneousValues: true,
  //   });

  //   if (user.roles) userDto.roles = user.roles.map((rol) => rol.role.name);
  //   if (user.municipality) userDto.municipality = user.municipality;

  //   return userDto;
  // }

  async findById(userId: string): Promise<UserResponseDto> {
    const user = await this.findFullWithId(userId);

    if (!user) throw new NotFoundException(`User with id ${userId} not found`);

    return UserMapper.toResponse(user);
  }

  async findFullWithId(id: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: { roles: { role: true }, municipality: true },
    });
    return user;
  }

  async findByUsername(index: string, value: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { [index]: value },
      select: {
        id: true,
        username: true,
        email: true,
        password: true,
      },
      // Seleccionar todos las columnas
      relations: { roles: { role: true }, municipality: true },
    });

    return user;
  }

  async findAll(
    userPagiationDto: UserPaginationDto,
  ): Promise<PaginationResponseDto<UserResponseDto>> {
    const { limit = 10, offset = 0, rol: rolName = 'all' } = userPagiationDto;

    // const users = await this.userRepository.find({
    //   take: limit,
    //   skip: offset,
    //   relations: { roles: { role: true } },
    //   // where: {
    //   //   roles: {
    //   //     role: {
    //   //       name: 'Admin',
    //   //     },
    //   //   },
    //   // },
    // });

    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .distinct(true)
      .leftJoinAndSelect('user.municipality', 'um')
      .leftJoinAndSelect('user.roles', 'ur')
      .leftJoinAndSelect('ur.role', 'role')
      .take(limit)
      .skip(offset);
    // .where('role.name = :rol', { rol })
    // .getMany();

    if (rolName !== 'all') {
      queryBuilder
        .innerJoin('user.roles', 'urFilter')
        .innerJoin('urFilter.role', 'roleFilter')
        .where('roleFilter.name = :rolName', { rolName });
    }

    const [users, total] = await queryBuilder.getManyAndCount();

    const page = Math.floor(offset / limit) + 1;
    const totalPages = Math.ceil(total / limit);

    return {
      total,
      page,
      totalPages,
      data: users.map((user) => UserMapper.toResponse(user)),
    };
    // return users.map((user) => this.toUserResponse(user));
  }

  async updateUser(updateUserDto: UpdateUserDto, user: User) {
    const userToUpdate = (await this.userRepository.preload({
      // id: user.id,
      ...user,
      ...updateUserDto,
    })) as User;

    if (updateUserDto?.municipalityId) {
      const municipality = await this.municipalityRepository.findOneBy({
        id: updateUserDto?.municipalityId,
      });

      if (municipality) {
        user.municipality = municipality;
      }
    }

    userToUpdate.updatedAt = new Date();
    await this.userRepository.save(userToUpdate);
    return UserMapper.toResponse(userToUpdate);
    // return userUpdated;
  }

  async disableUser(user: User) {
    user.isActive = false;
    await this.userRepository.save(user);

    return UserMapper.toResponse(user);
  }
}
