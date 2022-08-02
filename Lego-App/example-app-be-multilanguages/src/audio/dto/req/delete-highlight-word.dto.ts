import {
  IsValidNumber,
  IsValidText,
} from '../../../common/decorators/custom-validator.decorator';

export class DeleteHighlightWordDto {
  @IsValidNumber()
  audioId: number;

  @IsValidText()
  word: string;
}
