import { IsValidText } from '../../../../common/decorators/custom-validator.decorator';
import { PaginationQueryDto } from '../../../../common/dtos/pagination.dto';

export class GetVideoListDto extends PaginationQueryDto {
  @IsValidText({ required: false, maxLength: 100 })
  search?: string;
}
