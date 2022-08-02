import PaginateDto from '../../common/dtos/paginate.dto';
import { LangEnum } from '../../common/constants/global.constant';
import {
  IsValidEnumString, IsValidNumber,
} from '../../common/decorators/custom-validator.decorator';

export class FindManyLevelsDtoClient extends PaginateDto {
  @IsValidEnumString({ enum: LangEnum, required: false })
  lang?: LangEnum; //lang=en
}
