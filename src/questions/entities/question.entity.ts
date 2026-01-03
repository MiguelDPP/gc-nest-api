import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TypeQuestion } from './type-questions.entity';
import { User } from 'src/users/entities/user.entity';
import { Municipality } from 'src/location/entities/municipality.entity';
import { Answer } from './answer.entity';
import { BaseEntity } from 'src/common/entities/base.entity';

@Entity('questions')
export class Question extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', {
    nullable: true,
  })
  title: string;

  @Column('text')
  question: string;

  @ManyToOne(() => User, (user) => user.id, {
    eager: true,
  })
  user: User;

  @ManyToOne(() => TypeQuestion, (typeQuestion) => typeQuestion.id, {
    eager: true,
  })
  typeQuestion: TypeQuestion;

  @Column('int', {
    default: 30,
  })
  time: number;

  @Column('bool', {
    default: false,
    name: 'isValidated',
  })
  isValidated: boolean;

  @Column('int')
  point: number;

  @ManyToOne(() => Municipality, (municipality) => municipality.id, {
    eager: true,
  })
  municipality: Municipality;

  @OneToMany(() => Answer, (answer) => answer.question, {
    eager: true,
  })
  answers: Answer[];

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
