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
import { FunFacts } from './fun-facts.entity';
import { LabelsQuestionsRelationship } from './labels-questions-relationship.entity';

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
  points: number;

  @ManyToOne(() => Municipality, (municipality) => municipality.id, {
    eager: true,
    nullable: true,
  })
  municipality: Municipality;

  @OneToMany(() => Answer, (answer) => answer.question, {
    eager: true,
  })
  answers: Answer[];

  @OneToMany(() => FunFacts, (funFacts) => funFacts.question, {
    eager: true,
  })
  funFacts: FunFacts[];

  @OneToMany(
    () => LabelsQuestionsRelationship,
    (labelsQuestionsRelationship) => labelsQuestionsRelationship.question,
    {
      eager: true,
    },
  )
  labels: LabelsQuestionsRelationship[];

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
