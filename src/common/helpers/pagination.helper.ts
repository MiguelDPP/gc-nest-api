export const getPageAndTotalPages = (
  limit: number,
  offset: number,
  total: number,
): [number, number] => {
  const page = Math.floor(offset / limit) + 1;
  const totalPages = Math.ceil(total / limit);

  return [page, totalPages];
};
