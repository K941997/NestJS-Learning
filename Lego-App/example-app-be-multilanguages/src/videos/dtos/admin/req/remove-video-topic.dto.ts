import { IsValidNumber, IsValidText } from "../../../../common/decorators/custom-validator.decorator";


export class RemoveVideoTopicDto {
  @IsValidNumber({required: true})
  videoToTopicId: number
}