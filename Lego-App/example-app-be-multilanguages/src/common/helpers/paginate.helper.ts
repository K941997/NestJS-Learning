import { LIMIT } from '../constants/paginate.constant';

export const parseOffsetAndLimit = (page: number, limit: number = LIMIT) => {
  if (limit <= 0) {
    limit = LIMIT;
  }
  if (!page || page <= 0) {
    page = 1;
  }
  const finalPage = page - 1;
  const offset = finalPage * limit;

  return { offset, limit };
};
