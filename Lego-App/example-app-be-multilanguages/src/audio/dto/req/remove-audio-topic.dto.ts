import { IsValidNumber, IsValidText } from "../../../common/decorators/custom-validator.decorator";


export class RemoveAudioTopicDto {
  @IsValidNumber({required: true})
  audioToTopicId: number
}