/* eslint-disable prettier/prettier */
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, ValidateIf } from 'class-validator';
import { IsNull } from 'typeorm';
import { IsValidArrayNumber } from '../custom decorators/IsValidArrayNumber.decorator';

export class CreateTaskDto {
  @IsNotEmpty() //Không được rỗng
  @IsString()
  title: string;

  @IsString()
  description: string;

  // @IsArray()
  @IsValidArrayNumber() //!Custom Decorator (For CreateUpdateTask with Relation)
  @IsOptional() //!Update title, des, nhưng categoryIds không update
  categoryIds: number[];
}
