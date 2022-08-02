import { DEFAULT_LIMIT, DEFAULT_PAGE } from '../constants/global.constant';
import { IsValidNumber } from '../decorators/custom-validator.decorator';

class PaginateDto {
  @IsValidNumber({ required: false, min: 1 })
  page?: number = DEFAULT_PAGE;

  @IsValidNumber({ required: false, min: 1 })
  limit?: number = DEFAULT_LIMIT;
}

export default PaginateDto;
