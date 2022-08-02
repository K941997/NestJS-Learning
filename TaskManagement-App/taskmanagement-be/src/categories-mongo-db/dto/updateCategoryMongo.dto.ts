import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateCategoryMongoDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  description: string;
}
