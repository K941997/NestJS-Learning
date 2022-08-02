import { ApiExtraModels } from '@nestjs/swagger';
import { IsValidNumber } from '../decorators/custom-validator.decorator';

export class PaginationQueryDto {
  @IsValidNumber({ required: false, min: 1 })
  page?: number = 1;

  @IsValidNumber({ required: false, min: 1, max: 100 })
  limit?: number = 10;
}

@ApiExtraModels()
export class PaginationResultDto {
  // Need to be declare manual for swagger pluggin scan it
  items: any[];

  meta: {
    itemCount: number;
    totalItems?: number;
    itemsPerPage: number;
    totalPages?: number;
    currentPage: number;
  };

  links?: {
    first?: string;
    previous?: string;
    next?: string;
    last?: string;
  };
}
