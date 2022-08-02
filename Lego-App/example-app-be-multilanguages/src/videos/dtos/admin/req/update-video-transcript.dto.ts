import { IsValidNumber } from '../../../../common/decorators/custom-validator.decorator';
import { TranscriptResultDto } from '../../../../common/dtos/transciprt-result.dto';

export class UpdateVideoTranscriptDto extends TranscriptResultDto {
  @IsValidNumber({ required: true })
  transcriptId: number;
}
