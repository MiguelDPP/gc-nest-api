import { SeedDepartment } from './seed-department.interface';
import { SeedMunicipality } from './seed-municipality.interface';
import { SeedRoles } from './seed-roles.interface';
import { SeedUser } from './seed-user.interface';

export interface SeedData {
  departments: SeedDepartment[];
  municipalities: SeedMunicipality[];
  roles: SeedRoles[];
  users: SeedUser[];
}
