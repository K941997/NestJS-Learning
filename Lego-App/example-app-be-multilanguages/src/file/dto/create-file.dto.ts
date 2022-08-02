import { ApiProperty } from '@nestjs/swagger';
import { SupportFileType } from '../../common/constants/global.constant';
import {
  IsValidEnum, IsValidText
} from '../../common/decorators/custom-validator.decorator';

export class CreateFileDto {
  @ApiProperty()
  @IsValidText()
  key: string;

  @ApiProperty()
  @IsValidText()
  baseUrl: string;

  @ApiProperty()
  @IsValidText()
  bucket: string;

  @ApiProperty()
  @IsValidText()
  uploaderId: number;

  @ApiProperty()
  @IsValidEnum({ enum: SupportFileType, required: false })
  type?: SupportFileType;
}
