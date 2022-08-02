import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LoginTestDto {
  @IsEmail()
  @ApiProperty({default: 'test@test.com'})
  email: string;

  @IsString()
  @ApiProperty({default: 'Clv12345'})
  password: string;
}
