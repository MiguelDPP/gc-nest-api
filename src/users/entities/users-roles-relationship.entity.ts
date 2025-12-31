import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';
import { Role } from './role.entity';

@Entity({ name: 'users_roles_relationship' })
export class UsersRolesRelationship {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.id, {
    onDelete: 'CASCADE',
  })
  user: User;

  @ManyToOne(() => Role, (role) => role.id)
  role: Role;

  @Column('timestamptz')
  createdAt: Date;

  @Column('timestamptz', {
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
