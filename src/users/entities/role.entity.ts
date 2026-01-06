import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UsersRolesRelationship } from './users-roles-relationship.entity';
import { BaseEntity } from 'src/common/entities/base.entity';

@Entity({
  name: 'roles',
})
export class Role extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', {
    // Accepted values: 'admin', 'user', 'manager', etc.
    unique: true,
  })
  name: string;

  @OneToMany(
    () => UsersRolesRelationship,
    (usersRolesRelationship) => usersRolesRelationship.role,
  )
  users: UsersRolesRelationship[];

  // @Column('timestamptz')
  // createdAt: Date;

  // @Column('timestamptz', {
  //   default: () => 'CURRENT_TIMESTAMP',
  // })
  // updatedAt: Date;
}
