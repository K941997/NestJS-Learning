import {
  IsValidArrayString,
  IsValidNumber,
} from '../../../common/decorators/custom-validator.decorator';

export class AddHighlightWordDto {
  @IsValidNumber()
  audioId: number;

  @IsValidArrayString({ unique: true })
  words: string[];
}
