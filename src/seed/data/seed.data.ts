import { SeedData } from '../interfaces';
import { SedDepartments } from './departments.data';
import { SeedMunicipalities } from './municipalities.data';
import { RolesData } from './roles.data';
import { UsersData } from './users.data';

export const seedData: SeedData = {
  departments: SedDepartments,
  municipalities: SeedMunicipalities,
  roles: RolesData,
  users: UsersData,
};
