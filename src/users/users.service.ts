import { Injectable } from '@nestjs/common';
import { Role } from './entities/role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { SeedUser } from 'src/seed/interfaces';
import { Municipality } from 'src/location/entities/municipality.entity';
import { UsersRolesRelationship } from './entities/users-roles-relationship.entity';
import * as bcrypt from 'bcrypt';

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

  // Metodos generados
  // create(createUserDto: CreateUserDto) {
  //   return 'This action adds a new user';
  // }

  // findAll() {
  //   return `This action returns all users`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} user`;
  // }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }
}
