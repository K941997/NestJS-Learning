import { youtube_v3 } from 'googleapis';

export interface YoutubeVideoInfo {
  length: number | null;
  thumbnails: youtube_v3.Schema$ThumbnailDetails;
}
