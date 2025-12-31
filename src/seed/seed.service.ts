import { Injectable } from '@nestjs/common';
import { LocationService } from 'src/location/location.service';
import { seedData } from './data/seed.data';

@Injectable()
export class SeedService {
  constructor(private readonly locationService: LocationService) {}

  async runSeed() {
    await this.clearDatabase();

    await this.createLocations();
  }

  async clearDatabase() {
    await this.locationService.deleteAllMunicipalities();
    await this.locationService.deleteAllDepartments();
  }

  async createLocations() {
    const departments = seedData.departments;
    await this.locationService.createDepartmentsBulk(departments);
    await this.locationService.createMunicipalitiesBulk(
      seedData.municipalities,
    );
  }
}
