import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Question } from './question.entity';
import { BaseEntity } from 'src/common/entities/base.entity';

@Entity({
  name: 'answers',
})
export class Answer extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Question, (question) => question.answers)
  question: Question;

  @Column('text')
  response: string;

  @Column('bool')
  isCorrect: boolean;

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
