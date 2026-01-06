import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { LabelsService } from '../services/labels.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CreateLabelDto } from '../dto/labels/create-label.dto';
import { ValidRoles } from 'src/common/enum/valid-roles';
import { UpdateLabelDto } from '../dto/labels/update-label.dto';
import { LabelPaginationDto } from '../dto/labels/label-pagination.dto';

@Controller('labels')
export class LabelsController {
  constructor(private readonly labelsService: LabelsService) {}

  @Auth()
  @Get()
  findAll(@Query() labelPaginationDto: LabelPaginationDto) {
    return this.labelsService.findAll(labelPaginationDto);
  }

  @Auth()
  @Get(':labelId')
  findById(@Param('labelId', ParseUUIDPipe) labelId: string) {
    return this.labelsService.findById(labelId);
  }

  @Auth(ValidRoles.admin)
  @Post()
  create(@Body() createLabelDto: CreateLabelDto) {
    return this.labelsService.create(createLabelDto);
  }

  @Auth(ValidRoles.admin)
  @Patch(':labelId')
  update(
    @Param('labelId', ParseUUIDPipe) labelId: string,
    @Body() updateLabelDto: UpdateLabelDto,
  ) {
    return this.labelsService.update(labelId, updateLabelDto);
  }

  @Auth(ValidRoles.admin)
  @Delete(':labelId')
  delete(@Param('labelId', ParseUUIDPipe) labelId: string) {
    return this.labelsService.delete(labelId);
  }
}
