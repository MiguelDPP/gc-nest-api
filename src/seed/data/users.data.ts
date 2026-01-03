import { SeedUser } from '../interfaces';

export const UsersData: SeedUser[] = [
  {
    firstName: 'Miguel',
    surname: 'Portillo',
    username: 'miguelportillo',
    email: 'mdportillo08@gmail.com',
    password: 'Migueldp08#',
    municipalityId: 431,
    rolesId: ['admin', 'user'],
  },
  {
    firstName: 'Angie',
    secondName: 'Lorena',
    surname: 'Castro',
    secondSurname: 'Montoya',
    username: 'angielcastro',
    email: 'angie@gmail.com',
    password: 'Migueldp08#',
    municipalityId: 431,
    rolesId: ['user'],
  },
];
