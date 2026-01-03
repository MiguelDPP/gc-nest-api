import { BaseEntity } from 'src/common/entities/base.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
