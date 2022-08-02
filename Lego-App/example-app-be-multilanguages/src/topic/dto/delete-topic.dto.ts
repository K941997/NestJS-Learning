import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
export class DeleteTopicMultiDto {
  @IsArray()
  slugs: string[];
}
