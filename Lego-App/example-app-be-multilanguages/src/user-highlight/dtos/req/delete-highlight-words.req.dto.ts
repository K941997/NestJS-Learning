import {
  IsValidArrayNumber,
  IsValidArrayString,
} from '../../../common/decorators/custom-validator.decorator';

export class DeleteHighlightWordReqDto {
  @IsValidArrayNumber({ required: true, unique: true })
  highlightIds: number[];
}
