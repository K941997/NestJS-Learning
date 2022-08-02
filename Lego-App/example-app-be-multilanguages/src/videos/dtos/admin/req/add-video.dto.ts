import { IsBoolean, IsOptional, IsUrl } from 'class-validator';
import {
  IsValidArrayObject,
  IsValidArrayString, IsValidText
} from '../../../../common/decorators/custom-validator.decorator';
import { TranscriptResultDto } from '../../../../common/dtos/transciprt-result.dto';

// May be we need video type
export class AddVideoDto {
  @IsUrl()
  videoUrl: string;

  @IsValidText({ required: true })
  levelKey: string;

  @IsValidArrayString({ required: true, unique: true })
  topicKeys: string[];

  @IsValidArrayObject(
    { required: true, unique: true, maxSize: Infinity },
    TranscriptResultDto,
  )
  transcripts: TranscriptResultDto[];

  @IsValidText({ required: true, maxLength: 50 })
  name: string;

  @IsValidText({ required: true, maxLength: 255 })
  desc: string;

  @IsBoolean()
  @IsOptional()
  isFeature?: boolean = false

  @IsValidArrayString({ required: false, maxSize: Infinity, unique: true })
  highlightWords: string[];
}
