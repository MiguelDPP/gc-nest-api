import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Department } from './entities/department.entity';
import { Municipality } from './entities/municipality.entity';
import { CreateSeedMunicipalityDto } from './dto/create-seed-municipality.dto';

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,

    @InjectRepository(Municipality)
    private readonly munipalityRepository: Repository<Municipality>,
  ) {}

  // Department Methods
  async deleteAllDepartments(): Promise<void> {
    const queryBuilder = this.departmentRepository.createQueryBuilder();
    await queryBuilder.delete().where({}).execute();
  }

  async createDepartment(department: Partial<Department>): Promise<Department> {
    const newDepartment = this.departmentRepository.create(department);
    return this.departmentRepository.save(newDepartment);

    // Implementar el exception filter para manejar errores de base de datos
  }

  async createDepartmentsBulk(
    departments: Partial<Department>[],
  ): Promise<Department[]> {
    const newDepartments = this.departmentRepository.create(departments);
    return this.departmentRepository.save(newDepartments);
  }

  // Municipality Methods
  async deleteAllMunicipalities(): Promise<void> {
    const queryBuilder = this.munipalityRepository.createQueryBuilder();
    await queryBuilder.delete().where({}).execute();
  }

  async createMunicipalitiesBulk(
    municipalities: CreateSeedMunicipalityDto[],
  ): Promise<Municipality[]> {
    // Nesito guardar las municipalidades relacionando el departmentId
    const newMunicipalities: Municipality[] = municipalities.map((mun) => {
      const { departmentId, ...rest } = mun;
      const department = this.departmentRepository.create({
        id: departmentId,
      });
      return this.munipalityRepository.create({
        ...rest,
        department,
      });
    });
    return this.munipalityRepository.save(newMunicipalities);
  }
}
