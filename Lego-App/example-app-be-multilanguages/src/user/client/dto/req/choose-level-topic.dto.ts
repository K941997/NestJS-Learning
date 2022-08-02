import {
  IsValidText,
  IsValidArrayString,
} from '../../../../common/decorators/custom-validator.decorator';

export class ChooseLevelTopicDto {
  @IsValidText({ required: true })
  levelKey: string;

  @IsValidArrayString({ required: true, unique: true })
  topicKeys: string[];
}
