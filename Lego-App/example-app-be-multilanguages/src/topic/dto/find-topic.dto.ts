import { IsOptional } from 'class-validator';
import { BooleanEnum, LangEnum } from '../../common/constants/global.constant';
import {
  IsValidEnumString,
  IsValidNumber,
  IsValidText,
} from '../../common/decorators/custom-validator.decorator';

import PaginateDto from '../../common/dtos/paginate.dto';

export class FindTopicDto {
  @IsValidEnumString({ enum: LangEnum, required: false })
  lang?: LangEnum;
}

export class FindManyTopicDto extends PaginateDto {
  @IsValidText({ required: false })
  slug?: string;

  @IsValidEnumString({ enum: LangEnum, required: false })
  lang?: LangEnum; //lang=en
}
