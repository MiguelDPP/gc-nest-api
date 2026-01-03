import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { LocationService } from './location.service';

@Controller()
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Get('departments')
  getDepartments() {
    return this.locationService.getDepartments();
  }

  @Get('municipalities')
  getMunicipalities() {
    return this.locationService.getAllMunicipalities();
  }

  @Get('municipalities/:deparmentId')
  getMunicipalitiesByDepartmentId(
    @Param('deparmentId', ParseIntPipe) departmentId: number,
  ) {
    return this.locationService.getMunicipalitiesByDeparmentId(departmentId);
  }
}
