import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { ErrorsService } from './errors.service';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { Auth } from 'src/auth/decorators/auth.decorator';
import {
  CreateErrorDto,
  ErrorPaginationDto,
  UpdateErrorDto,
  CreateCommentDto,
} from './dto';
import { CommentPaginationDto } from './dto/comments/comment-pagination.dto';
import { ValidRoles } from 'src/common/enum/valid-roles';

@Controller('errors')
export class ErrorsController {
  constructor(private readonly errorsService: ErrorsService) {}

  @Auth()
  @Post()
  create(@Body() createErrorDto: CreateErrorDto, @GetUser() user: User) {
    return this.errorsService.create(createErrorDto, user);
  }

  @Auth()
  @Get('my')
  findAllByUser(
    @GetUser() user: User,
    @Query() errorPaginationDto: ErrorPaginationDto,
  ) {
    return this.errorsService.findAllByUser(user, errorPaginationDto);
  }

  @Auth()
  @Post('comments')
  createCommentError(
    @Body() createCommentDto: CreateCommentDto,
    @GetUser() user: User,
  ) {
    return this.errorsService.createComment(createCommentDto, user);
  }

  @Auth()
  @Get(':errorId/comments')
  findAllCommentsByError(
    @Param('errorId', ParseUUIDPipe) errorId: string,
    @GetUser() user: User,
    @Query() commentPaginationDto: CommentPaginationDto,
  ) {
    return this.errorsService.findAllCommentsByError(
      errorId,
      user,
      commentPaginationDto,
    );
  }

  @Auth()
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string, @GetUser() user: User) {
    return this.errorsService.findOne(id, user);
  }

  @Auth()
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateErrorDto: UpdateErrorDto,
    @GetUser() user: User,
  ) {
    return this.errorsService.update(id, updateErrorDto, user);
  }

  @Auth(ValidRoles.admin)
  @Get()
  findAll(@Query() errorPaginationDto: ErrorPaginationDto) {
    return this.errorsService.findAll(errorPaginationDto);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.errorsService.remove(+id);
  // }
}
