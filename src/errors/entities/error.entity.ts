import { BaseEntity } from 'src/common/entities/base.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Comment } from './comment.entity';

@Entity({
  name: 'errors',
})
export class Error extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.id, { eager: true })
  user: User;

  @OneToMany(() => Comment, (comment) => comment.error, {
    onDelete: 'CASCADE',
  })
  comments: Comment[];

  @Column('text')
  title: string;

  @Column('text')
  description: string;

  @Column('text', { nullable: true })
  url: string;

  @Column('bool', { default: false })
  isResolved: boolean;
}
