import { IsValidNumber } from '../../../../common/decorators/custom-validator.decorator';
import { TranscriptResultDto } from '../../../../common/dtos/transciprt-result.dto';

export class AddVideoTranscriptDto extends TranscriptResultDto {
  @IsValidNumber({required: true})
  videoId: number
}
