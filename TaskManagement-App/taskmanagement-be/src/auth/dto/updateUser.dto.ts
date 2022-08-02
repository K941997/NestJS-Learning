/* eslint-disable prettier/prettier */
import { IsArray, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  name: string;

  @IsString()
  @MinLength(5)
  @MaxLength(20)
  @Matches(/(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])/, { //regex password
    message: 'At least 1 upper case, 1 lower case, 1 digit in your password',
  })
  @IsNotEmpty()
  password: string;
}
