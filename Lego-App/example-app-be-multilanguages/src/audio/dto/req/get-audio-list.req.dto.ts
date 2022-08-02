import { IsValidText } from '../../../common/decorators/custom-validator.decorator';
import { PaginationQueryDto } from '../../../common/dtos/pagination.dto';

export class GetAudioListReqDto extends PaginationQueryDto {
  @IsValidText({ required: false, maxLength: 100 })
  search?: string;

  @IsValidText({ required: false, maxLength: 100 })
  topicKey?: string;

  @IsValidText({ required: false, maxLength: 100 })
  levelKey?: string;
}
