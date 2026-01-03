export class PaginationResponseDto<T> {
  page: number;
  total: number;
  totalPages: number;
  data: T[];
}
