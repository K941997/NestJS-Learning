/* eslint-disable prettier/prettier */
import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class AuthCredentialsDto {
  //DTO ValidationPipe dùng cho cả SignUp + SignIn
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @IsNotEmpty()
  username: string;

  @IsString()
  @MinLength(5)
  @MaxLength(20)
  @Matches(/(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])/, { //regex password
    message: 'At least 1 upper case, 1 lower case, 1 digit in your password',
  })
  @IsNotEmpty()
  password: string;
}
