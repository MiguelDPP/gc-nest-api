import { Injectable } from '@nestjs/common';
import { LocationService } from 'src/location/location.service';
import { seedData } from './data/seed.data';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class SeedService {
  constructor(
    private readonly locationService: LocationService,
    private readonly usersService: UsersService,
  ) {}

  async runSeed() {
    await this.clearDatabase();

    await this.createLocations();
  }

  async clearDatabase() {
    await this.usersService.deleteAllUsers();
    await this.locationService.deleteAllMunicipalities();
    await this.locationService.deleteAllDepartments();
    await this.usersService.deleteAllRoles();
  }

  async createLocations() {
    const departments = seedData.departments;
    await this.locationService.createDepartmentsBulk(departments);
    await this.locationService.createMunicipalitiesBulk(
      seedData.municipalities,
    );
    await this.usersService.createForSeedRoles(seedData.roles);
    return await this.usersService.createForSeedUsers(seedData.users);
  }
}
