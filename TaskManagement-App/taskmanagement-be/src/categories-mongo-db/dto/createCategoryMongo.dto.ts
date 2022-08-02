import { IsNotEmpty, IsString } from 'class-validator';
import { IsNull } from 'typeorm';

export class CreateCategoryMongoDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  description: string;
}
