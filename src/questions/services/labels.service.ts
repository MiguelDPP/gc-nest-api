import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Label } from '../entities/label.entity';
import { In, Repository } from 'typeorm';
import { CreateLabelDto } from '../dto/labels/create-label.dto';
import { LabelResponseDto } from '../dto/labels/label-response.dto';
import { ramdomHexColor } from 'src/common/helpers/ramdom-hex-color';
import { UpdateLabelDto } from '../dto/labels/update-label.dto';
import { LabelPaginationDto } from '../dto/labels/label-pagination.dto';
import { PaginationResponseDto } from 'src/common/dto/pagination-response.dto';
import { getPageAndTotalPages } from 'src/common/helpers/pagination.helper';

@Injectable()
export class LabelsService {
  constructor(
    @InjectRepository(Label)
    private readonly labelRespository: Repository<Label>,
  ) {}
  async findAll(
    labelPaginationDto: LabelPaginationDto,
  ): Promise<PaginationResponseDto<LabelResponseDto>> {
    const { name, limit = 10, offset = 0 } = labelPaginationDto;

    const labelBuilder = this.labelRespository
      .createQueryBuilder('label')
      .skip(offset)
      .take(limit);

    if (name && name !== '') {
      labelBuilder.where('label.name ILIKE :search', { search: `%${name}%` });
    }

    const [labels, total] = await labelBuilder.getManyAndCount();
    const [page, totalPages] = getPageAndTotalPages(limit, offset, total);

    return {
      data: labels.map((label) => this.toLabelDtoResponse(label)),
      page,
      totalPages,
      total,
    };
  }

  private toLabelDtoResponse(label: Label): LabelResponseDto {
    return {
      ...label,
    };
  }

  async create(createLabelDto: CreateLabelDto): Promise<LabelResponseDto> {
    const label = this.labelRespository.create(createLabelDto);

    if (!label.color) {
      label.color = ramdomHexColor();
    }

    await this.labelRespository.save(label);

    return this.toLabelDtoResponse(label);
  }

  private async findLabelById(labelId: string) {
    const label = await this.labelRespository.findOneBy({ id: labelId });
    if (!label)
      throw new NotFoundException(`Label with id ${labelId} not found`);

    return label;
  }

  async findById(labelId: string) {
    return this.toLabelDtoResponse(await this.findLabelById(labelId));
  }

  async update(labelId: string, updateLabelDto: UpdateLabelDto) {
    const label = await this.findLabelById(labelId);

    const labelToUpdate = (await this.labelRespository.preload({
      ...label,
      ...updateLabelDto,
    })) as Label;

    labelToUpdate.updatedAt = new Date();

    await this.labelRespository.save(labelToUpdate);

    return this.toLabelDtoResponse(labelToUpdate);
  }

  async delete(labelId: string) {
    const label = await this.findLabelById(labelId);

    const { affected } = await this.labelRespository.delete({ id: label.id });

    if (affected === 0) throw new BadRequestException('Error to delete label');
  }

  async findByIds(labelIds: string[]) {
    return this.labelRespository.findBy({
      id: In(labelIds),
    });
  }
}
