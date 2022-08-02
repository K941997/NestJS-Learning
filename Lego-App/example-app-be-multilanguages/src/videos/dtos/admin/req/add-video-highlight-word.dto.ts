import { IsValidNumber, IsValidText } from "../../../../common/decorators/custom-validator.decorator";

export class AddVideoHighlightWordDto {
@IsValidNumber({required: true})
videoId: number

  @IsValidText({required: true, maxLength: 50})
  highlightWord: string
}