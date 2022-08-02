import { IsValidNumber } from "../../../../common/decorators/custom-validator.decorator";

export class RemoveVideoTranscriptDto {
  @IsValidNumber({required: true})
  transcriptId: number
}