import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { Municipality } from './municipality.entity';

@Entity({
  name: 'departments',
})
export class Department {
  @ApiProperty({
    example: '1',
    description: 'Id del departamento',
    uniqueItems: true,
  })
  @PrimaryColumn('int', {
    unique: true,
  })
  id: number;

  @ApiProperty({
    example: 'Cesar',
    description: 'Nombre del departamento',
    uniqueItems: true,
  })
  @Column('text', {
    unique: true,
  })
  name: string;

  @OneToMany(() => Municipality, (municipality) => municipality.department, {
    cascade: true,
    eager: true,
  })
  municipalities?: Municipality[];

  @Column('timestamptz', { default: () => 'CURRENT_TIMESTAMP', select: false })
  createdAt: Date;

  @Column('timestamptz', { default: () => 'CURRENT_TIMESTAMP', select: false })
  updatedAt: Date;
}
