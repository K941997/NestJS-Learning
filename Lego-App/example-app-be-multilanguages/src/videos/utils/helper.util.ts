const REGEX_YOUTUBE =
  /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/im;

/**
 * Retrieve video id from url or string
 * @param videoUrlOrId video url or video id
 * @returns videoId or undefined
 */
export const getVideoYoutubeId = (videoUrlOrId: string) => {
  if (videoUrlOrId.length === 11) {
    return videoUrlOrId;
  }
  const matchId = REGEX_YOUTUBE.exec(videoUrlOrId);
  if (matchId?.length) {
    return matchId[1];
  }
};

/**
 *
 * @param {string} videoId Id of Youtube video
 */
export const generateYoutubeLink = (videoId: string) => {
  return `https://youtu.be/${videoId}`;
};
