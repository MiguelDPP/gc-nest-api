import { BaseEntity } from 'src/common/entities/base.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Error } from './error.entity';
import { User } from 'src/users/entities/user.entity';

@Entity({
  name: 'comments',
})
export class Comment extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Error, (error) => error.comments, {
    onDelete: 'CASCADE',
  })
  error: Error;

  @ManyToOne(() => User, (user) => user.id, { eager: true })
  user: User;

  @Column('text')
  message: string;
}
