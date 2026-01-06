import { Injectable } from '@nestjs/common';
import { LocationService } from 'src/location/location.service';
import { seedData } from './data/seed.data';
import { UsersService } from 'src/users/users.service';
import { TypeQuestionsService } from 'src/questions/services/type-questions.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class SeedService {
  constructor(
    private readonly locationService: LocationService,
    private readonly usersService: UsersService,
    private readonly typeQuestionsService: TypeQuestionsService,

    @InjectRepository(Error)
    private readonly errorsRepository: Repository<Error>,
  ) {}

  async runSeed() {
    await this.clearDatabase();

    await this.createLocations();
  }

  private deleteAllErrors() {
    const query = this.errorsRepository.createQueryBuilder('error');
    return query.delete().where({}).execute();
  }

  async clearDatabase() {
    await this.deleteAllErrors();
    await this.usersService.deleteAllUsers();
    await this.locationService.deleteAllMunicipalities();
    await this.locationService.deleteAllDepartments();
    await this.usersService.deleteAllRoles();
    await this.typeQuestionsService.deleteAllTypeQuestions();
  }

  async createLocations() {
    const departments = seedData.departments;
    await this.locationService.createDepartmentsBulk(departments);
    await this.locationService.createMunicipalitiesBulk(
      seedData.municipalities,
    );
    await this.usersService.createForSeedRoles(seedData.roles);
    await this.typeQuestionsService.createForSeedTypeQuestions(
      seedData.typeQuestions,
    );
    return await this.usersService.createForSeedUsers(seedData.users);
  }
}
