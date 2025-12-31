import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { Department } from './department.entity';

@Entity({
  name: 'municipalities',
})
export class Municipality {
  @ApiProperty({
    example: 1,
    description: 'The unique identifier of the municipality',
  })
  // @PrimaryGeneratedColumn('')
  @PrimaryColumn('int')
  id: number;

  @ApiProperty({
    example: 'Aguahica',
    description: 'The name of the municipality',
  })
  @Column('text')
  name: string;

  @ApiProperty({
    description: 'The department to which the municipality belongs',
    type: () => Department,
  })
  @ManyToOne(
    () => Department,
    (department) => department.id,
    {
      eager: true,
      onDelete: 'CASCADE',
      // cascade: true, // Permite guardar el departamento relacionado al guardar una municipalidad
    }, // Cargar siempre la relación
  )
  department: Department;

  @Column('timestamptz', { default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column('timestamptz', { default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
