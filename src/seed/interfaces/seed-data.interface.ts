import { SeedDepartment } from './seed-department.interface';
import { SeedMunicipality } from './seed-municipality.interface';

export interface SeedData {
  departments: SeedDepartment[];
  municipalities: SeedMunicipality[];
}
