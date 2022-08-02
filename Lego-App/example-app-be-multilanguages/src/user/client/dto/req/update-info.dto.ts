import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNumber, IsPhoneNumber } from 'class-validator';
import { IsValidText } from '../../../../common/decorators/custom-validator.decorator';

export class UpdateInfoDTO {
  @ApiProperty()
  @IsNumber()
  avatarId: number;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsPhoneNumber('VN')
  phone: string;

  @ApiProperty()
  @IsValidText({ maxLength: 255 })
  fullname: string;

  constructor(partial: Partial<UpdateInfoDTO>) {
    Object.assign(this, partial);
  }
}
