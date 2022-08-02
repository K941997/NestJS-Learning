import PaginateDto from '../../common/dtos/paginate.dto';
import { LangEnum } from '../../common/constants/global.constant';
import {
  IsValidEnumNumber,
  IsValidEnumString,
  IsValidNumber,
  IsValidText,
} from '../../common/decorators/custom-validator.decorator';

export class FindOneLevelDto {
  @IsValidEnumString({ enum: LangEnum, required: false })
  lang?: LangEnum;
}

export class FindManyLevelsDto extends PaginateDto {
  @IsValidText({ required: false })
  slug?: string;

  @IsValidEnumString({ enum: LangEnum, required: false })
  lang?: LangEnum; //lang=en
}
