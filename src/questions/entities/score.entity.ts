import { BaseEntity } from 'src/common/entities/base.entity';
import { User } from 'src/users/entities/user.entity';
import { Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
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

  @OneToMany(() => ScoreQuestions, (scoreQuestions) => scoreQuestions.score)
  scoreQuestions: ScoreQuestions[];
}
