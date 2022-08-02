import { ApiProperty } from '@nestjs/swagger';
import { SupportedAudioFileType } from '../../../common/constants/global.constant';
import {
  IsValidEnum, IsValidNumber,
  IsValidText
} from '../../../common/decorators/custom-validator.decorator';
import { getValEnumStr } from '../../../common/utils';

export class CreateAudioTranscriptDto {
  @ApiProperty({ required: true })
  @IsValidNumber()
  audioId: number;

  @ApiProperty({ required: true })
  @IsValidText()
  audioCode: string;

  @ApiProperty({ enum: getValEnumStr(SupportedAudioFileType), required: true })
  @IsValidEnum({ enum: SupportedAudioFileType })
  mediaFormat: string;
}
