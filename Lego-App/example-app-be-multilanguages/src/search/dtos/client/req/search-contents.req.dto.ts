import {
  IsValidText
} from '../../../../common/decorators/custom-validator.decorator';
import { PaginationQueryDto } from '../../../../common/dtos/pagination.dto';

export class SearchContentsReqDto extends PaginationQueryDto {
  @IsValidText({ required: true, maxLength: 100 })
  keyword: string;
}
