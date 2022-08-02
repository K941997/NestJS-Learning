import { PaginationResultDto } from '../../../../common/dtos/pagination.dto';
import { Videos } from '../../../entities/videos.entity';

export class VideoListResDto extends PaginationResultDto {
  items: Videos[];
}
