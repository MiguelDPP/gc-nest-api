import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Question } from './question.entity';
import { BaseEntity } from 'src/common/entities/base.entity';

@Entity({
  name: 'fun_facts',
})
export class FunFacts extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', {
    nullable: true,
  })
  title?: string;

  @ManyToOne(() => Question, (question) => question.funFacts, {
    onDelete: 'CASCADE',
  })
  question: Question;

  @Column('text')
  content: string;
}
