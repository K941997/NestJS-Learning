import { ApiExtraModels } from '@nestjs/swagger';
import { youtube_v3 } from 'googleapis';

@ApiExtraModels()
export class YoutubeVideoThumbnailDetails
  implements youtube_v3.Schema$Thumbnail
{
  url: string;
  height: number;
  width: number;
}

@ApiExtraModels()
export class YoutubeVideoThumbnail
  implements youtube_v3.Schema$ThumbnailDetails
{
  default?: YoutubeVideoThumbnailDetails;
  medium?: YoutubeVideoThumbnailDetails;
  high?: YoutubeVideoThumbnailDetails;
  standard?: YoutubeVideoThumbnailDetails;
  maxres?: YoutubeVideoThumbnailDetails;
}
