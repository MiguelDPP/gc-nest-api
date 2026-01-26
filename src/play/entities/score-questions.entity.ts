import { BaseEntity } from 'src/common/entities/base.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Score } from './score.entity';
import { Question } from 'src/questions/entities/question.entity';

@Entity({
  name: 'score_questions',
})
export class ScoreQuestions extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Score, (score) => score.scoreQuestions, {
    onDelete: 'CASCADE',
  })
  score: Score;

  @ManyToOne(() => Question, (question) => question.id, {
    onDelete: 'CASCADE',
    eager: true,
  })
  question: Question;

  @Column('bool', {
    nullable: true,
  })
  answer?: boolean;
}
