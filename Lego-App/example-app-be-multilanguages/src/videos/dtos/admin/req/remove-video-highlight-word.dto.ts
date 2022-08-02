import { IsValidNumber } from '../../../../common/decorators/custom-validator.decorator';

export class RemoveHighlightWordDto {
  @IsValidNumber({ required: true })
  highlightWordId: number;
}
