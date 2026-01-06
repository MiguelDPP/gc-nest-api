import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Error } from './entities/error.entity';
import { ErrorMapper } from './mappers/error.mapper';
import { PaginationResponseDto } from 'src/common/dto/pagination-response.dto';
import { getPageAndTotalPages } from 'src/common/helpers/pagination.helper';
import {
  CommentResponseDto,
  CreateCommentDto,
  CreateErrorDto,
  ErrorPaginationDto,
  ErrorResponseDto,
  UpdateErrorDto,
} from './dto';
import { Comment } from './entities/comment.entity';
import { CommentPaginationDto } from './dto/comments/comment-pagination.dto';

@Injectable()
export class ErrorsService {
  constructor(
    @InjectRepository(Error)
    private readonly errorRepository: Repository<Error>,

    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}
  async create(
    createErrorDto: CreateErrorDto,
    user: User,
  ): Promise<ErrorResponseDto> {
    const error = this.errorRepository.create({
      ...createErrorDto,
      user,
    });
    await this.errorRepository.save(error);

    return ErrorMapper.toErrorResponseDto(error);
  }

  async createComment(
    createCommentDto: CreateCommentDto,
    user: User,
  ): Promise<CommentResponseDto> {
    const error = await this.findError(createCommentDto.errorId, user);

    const comment = this.commentRepository.create({
      ...createCommentDto,
      user: user,
      error: error,
    });

    // Quitar los comentarios de error para evitar ciclos infinitos al serializar

    await this.commentRepository.save(comment);

    const errorMapped = ErrorMapper.toCommentResponseDto(comment);
    delete errorMapped.error.comments;

    return errorMapped;
  }

  async findError(id: string, user: User): Promise<Error> {
    const error = await this.errorRepository.findOneBy({ id });

    if (!error) {
      throw new NotFoundException('Error not found');
    }

    if (
      error.user.id !== user.id &&
      !user.roles.some((r) => r.role.name === 'admin')
    ) {
      throw new NotFoundException('Error not found');
    }
    return error;
  }

  async findOne(id: string, user: User) {
    return ErrorMapper.toErrorResponseDto(await this.findError(id, user));
  }

  async update(id: string, updateErrorDto: UpdateErrorDto, user: User) {
    const error = await this.findError(id, user);

    const errorToUpdate = this.errorRepository.merge(error, updateErrorDto);
    errorToUpdate.updatedAt = new Date();
    await this.errorRepository.save(errorToUpdate);

    return ErrorMapper.toErrorResponseDto(errorToUpdate);
  }

  async findAllByUser(
    user: User,
    errorPaginationDto: ErrorPaginationDto,
  ): Promise<PaginationResponseDto<ErrorResponseDto>> {
    const { limit = 10, offset = 0, isResolved } = errorPaginationDto;
    const queryBuilder = this.errorRepository.createQueryBuilder('error');

    if (isResolved !== undefined) {
      queryBuilder.andWhere('error.isResolved = :isResolved', {
        isResolved,
      });
    }

    const [errors, total] = await queryBuilder
      .leftJoinAndSelect('error.user', 'user')
      .leftJoinAndSelect('user.roles', 'roles')
      .leftJoinAndSelect('roles.role', 'role')
      .where('error.userId = :userId', { userId: user.id })
      .skip(offset)
      .take(limit)
      .getManyAndCount();

    const [page, totalPages] = getPageAndTotalPages(limit, offset, total);

    return {
      page,
      totalPages,
      total,
      data: ErrorMapper.toErrorResponseDtoList(errors),
    };

    // const errors = await this.errorRepository.find({
    //   where: { user: { id: user.id } },
    //   relations: { user: { roles: { role: true } } },
    // });

    // return ErrorMapper.toErrorResponseDtoList(errors);
  }

  async findAllCommentsByError(
    errorId: string,
    user: User,
    commentPaginationDto: CommentPaginationDto,
  ): Promise<PaginationResponseDto<CommentResponseDto>> {
    const { limit = 10, offset = 0 } = commentPaginationDto;
    const error = await this.findError(errorId, user);

    const queryBuilder = this.commentRepository.createQueryBuilder('comment');

    const [comments, total] = await queryBuilder
      .leftJoinAndSelect('comment.user', 'user')
      .leftJoinAndSelect('user.roles', 'roles')
      .leftJoinAndSelect('roles.role', 'role')
      .where('comment.errorId = :errorId', { errorId: error.id })
      .skip(offset)
      .take(limit)
      .getManyAndCount();

    const [page, totalPages] = getPageAndTotalPages(limit, offset, total);

    return {
      page,
      totalPages,
      total,
      data: ErrorMapper.toCommentResponseDtoList(comments),
    };
  }

  async findAll(
    errorPaginationDto: ErrorPaginationDto,
  ): Promise<PaginationResponseDto<ErrorResponseDto>> {
    const { limit = 10, offset = 0, isResolved } = errorPaginationDto;
    const queryBuilder = this.errorRepository.createQueryBuilder('error');
    if (isResolved !== undefined) {
      queryBuilder.andWhere('error.isResolved = :isResolved', {
        isResolved,
      });
    }
    const [errors, total] = await queryBuilder
      .leftJoinAndSelect('error.user', 'user')
      .leftJoinAndSelect('user.roles', 'roles')
      .leftJoinAndSelect('roles.role', 'role')
      .skip(offset)
      .take(limit)
      .getManyAndCount();
    const [page, totalPages] = getPageAndTotalPages(limit, offset, total);

    return {
      page,
      totalPages,
      total,
      data: ErrorMapper.toErrorResponseDtoList(errors),
    };
  }
}
