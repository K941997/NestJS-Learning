import { ApiProperty } from '@nestjs/swagger';
import { AudioType } from '../../../common/constants/global.constant';
import {
  IsValidText,
  IsValidEnum,
  IsValidNumber,
  IsValidArrayString,
} from '../../../common/decorators/custom-validator.decorator';
import { getValEnumStr } from '../../../common/helpers/enum.helper';

export class UpdateAudioDto {
  @ApiProperty({ required: true })
  @IsValidText({ matches: /^[0-9a-zA-Z._-]+/ })
  audioCode: string;

  @ApiProperty({ enum: getValEnumStr(AudioType), required: true })
  @IsValidEnum({ enum: AudioType })
  audioTypeKey: string;

  @ApiProperty()
  @IsValidText()
  title: string;

  @ApiProperty()
  @IsValidText()
  desc: string;

  @ApiProperty()
  @IsValidNumber()
  fileId: number;

  @ApiProperty()
  @IsValidNumber()
  audioThumbnailId: number;

  @ApiProperty()
  @IsValidArrayString({ required: true, unique: true })
  topicKeys: string[];

  @ApiProperty()
  @IsValidText({ required: true })
  levelKey: string;
}
