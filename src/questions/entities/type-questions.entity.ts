import { BaseEntity } from 'src/common/entities/base.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'type_questions',
})
export class TypeQuestion extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  name: string;

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
