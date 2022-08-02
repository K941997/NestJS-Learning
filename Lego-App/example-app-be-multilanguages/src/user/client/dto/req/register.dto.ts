import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsPhoneNumber, IsString } from 'class-validator';
import { IsValidText } from '../../../../common/decorators/custom-validator.decorator';

export class RegisterDTO {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsPhoneNumber('VN')
  phone: string;

  @ApiProperty()
  @IsValidText({ maxLength: 255 })
  fullname: string;

  @ApiProperty()
  @IsString()
  firIdToken: string;

  constructor(partial: Partial<RegisterDTO>) {
    Object.assign(this, partial);
  }
}
