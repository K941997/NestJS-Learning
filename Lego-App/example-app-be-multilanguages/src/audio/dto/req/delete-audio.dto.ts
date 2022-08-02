import { IsValidArrayNumber } from '../../../common/decorators/custom-validator.decorator';

export class DeleteAudiosReqDto {
  @IsValidArrayNumber({ unique: true, required: true, minSize: 1, maxSize: 20 })
  ids: number[];
}
