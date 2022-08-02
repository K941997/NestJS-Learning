import { IsOptional } from 'class-validator';
import { BooleanEnum, LangEnum } from '../../common/constants/global.constant';
import {
  IsValidEnumString, IsValidNumber,
} from '../../common/decorators/custom-validator.decorator';
import PaginateDto from '../../common/dtos/paginate.dto';

export class FindManyTopicDtoClient extends PaginateDto {
  @IsValidEnumString({ enum: LangEnum, required: false })
  lang?: LangEnum; //lang=en
}
