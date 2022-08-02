/* eslint-disable prettier/prettier */
import { IsArray, IsEmpty, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';
import { IsNull } from 'typeorm';
import { IsValidArrayNumber } from '../custom decorators/IsValidArrayNumber.decorator';

export class UpdateTaskDto {
  @IsNotEmpty() //Không được rỗng
  @IsString()
  title: string;

  @IsString()
  @IsOptional() //!Update title, nhưng des không update
  description: string;

  @IsArray()
  @IsOptional() //!Update title, des, nhưng categoryIds không update
  // @IsValidArrayNumber() //!Update title, des, nhưng categoryIds không update
  categoryIds: number[];
}
