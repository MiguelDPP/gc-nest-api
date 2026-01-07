import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Question } from './question.entity';
import { Label } from './label.entity';
import { BaseEntity } from 'src/common/entities/base.entity';

@Entity({
  name: 'labels_questions_relationship',
})
export class LabelsQuestionsRelationship extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Question, (question) => question.labels, {
    onDelete: 'CASCADE',
  })
  question: Question;

  @ManyToOne(() => Label, (label) => label.questions, {
    onDelete: 'CASCADE',
  })
  label: Label;
}
