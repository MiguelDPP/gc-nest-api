import { Expose } from 'class-transformer';
// import { Municipality } from 'src/location/entities/municipality.entity';

export class UserResponseDto {
  @Expose()
  id: string;

  @Expose()
  firstName: string;

  @Expose()
  username: string;

  @Expose()
  secondName?: string;

  @Expose()
  surname: string;

  @Expose()
  secondSurname?: string;

  @Expose()
  email: string;

  @Expose()
  photo?: string;

  @Expose()
  municipality: {
    id: number;
    name: string;
  };

  @Expose()
  roles: string[];

  @Expose()
  isActive: boolean;
}
