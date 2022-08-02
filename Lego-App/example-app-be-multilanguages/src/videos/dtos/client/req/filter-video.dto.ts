import { Transform } from 'class-transformer';
import {
  IsValidArrayString,
  IsValidText,
} from '../../../../common/decorators/custom-validator.decorator';
import PaginateDto from '../../../../common/dtos/paginate.dto';

export class FilterVideoDto extends PaginateDto {
  @IsValidText({ required: false })
  levelKey?: string;

  // When value type array pass in url, if just one element, then it will be transform into string
  // So we need to convert one value to array
  @IsValidArrayString({ required: false, unique: true })
  @Transform(({ value }) => (typeof value === 'string' ? [value] : value))
  topicKeys?: string[];
}
