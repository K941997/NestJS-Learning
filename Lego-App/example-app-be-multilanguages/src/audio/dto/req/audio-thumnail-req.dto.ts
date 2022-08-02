export class AudioThumbnailReq {
  audioId: number;
  fileId: number;
  thumbnailId: number;
}

export class AudioThumbnailUpdateReq {
  id: number;
  audioId: number;
  fileId: number;
  thumbnailId: number;
}
