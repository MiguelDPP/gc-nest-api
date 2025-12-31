import { SeedData } from '../interfaces';
import { SedDepartments } from './departments.data';
import { SeedMunicipalities } from './municipalities.data';

export const seedData: SeedData = {
  departments: SedDepartments,
  municipalities: SeedMunicipalities,
};
