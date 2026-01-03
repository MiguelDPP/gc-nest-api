import { Municipality } from 'src/location/entities/municipality.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UsersRolesRelationship } from './users-roles-relationship.entity';
import { BaseEntity } from 'src/common/entities/base.entity';

@Entity({
  name: 'users',
})
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  firstName: string;

  @Column('text', {
    nullable: true,
  })
  secondName?: string;

  @Column('text')
  surname: string;

  @Column('text', {
    nullable: true,
  })
  secondSurname?: string;

  @Column('text', {
    unique: true,
  })
  username: string;

  @Column('text', {
    unique: true,
  })
  email: string;

  @Column('text', {
    select: false,
  })
  password: string;

  @Column('timestamptz', {
    nullable: true,
  })
  emailVerifiedAt?: Date;

  @Column('text', {
    nullable: true,
  })
  codeVerification?: string;

  @ManyToOne(() => Municipality, (municipality) => municipality.id, {
    eager: true,
  })
  municipality: Municipality;

  @Column('text', {
    nullable: true,
  })
  photo: string;

  @Column('bool', {
    default: true,
  })
  isActive: boolean;

  @OneToMany(
    () => UsersRolesRelationship,
    (usersRolesRelationship) => usersRolesRelationship.user,
    {
      eager: true,
      cascade: true,
    },
  )
  roles: UsersRolesRelationship[];

  // @Column('timestamptz', {
  //   select: false,
  // })
  // createdAt: Date;

  // @Column('timestamptz', {
  //   default: () => 'CURRENT_TIMESTAMP',
  //   select: false,
  // })
  // updatedAt: Date;
}
