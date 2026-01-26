import { BaseEntity } from 'src/common/entities/base.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ScoreQuestions } from './score-questions.entity';

@Entity({
  name: 'scores',
})
export class Score extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.scores, {
    onDelete: 'CASCADE',
  })
  user: User;

  @Column('int', { default: 0 })
  totalPoints: number;

  @Column('int', { default: 0 })
  correctAnswers: number;

  @Column('int', { default: 0 })
  totalQuestions: number;

  @OneToMany(() => ScoreQuestions, (scoreQuestions) => scoreQuestions.score)
  scoreQuestions: ScoreQuestions[];

  @Column('bool', { default: false })
  isFinished: boolean;
}
