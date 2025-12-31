export interface SeedUser {
  firstName: string;
  secondName?: string;
  surname: string;
  secondSurname?: string;
  username: string;
  email: string;
  password: string;
  municipalityId: number;
  photo?: string;
  isActive?: boolean;
  rolesId: string[];
}
