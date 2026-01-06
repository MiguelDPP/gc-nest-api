import { BaseEntity } from 'src/common/entities/base.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { LabelsQuestionsRelationship } from './labels-questions-relationship.entity';

@Entity({
  name: 'labels',
})
export class Label extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', {
    unique: true,
  })
  name: string;

  @Column('text')
  description: string;

  @Column('text', {
    nullable: true,
  })
  color: string;

  @OneToMany(
    () => LabelsQuestionsRelationship,
    (labelsQuestionsRelationship) => labelsQuestionsRelationship.label,
  )
  questions: LabelsQuestionsRelationship[];

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
