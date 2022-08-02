import { PaginationResultDto } from '../../../common/dtos/pagination.dto';
import { Level } from '../../../level/entities/level.entity';
import { AudioHighlightWords } from '../../entities/audio-highlight-words.entity';
import { AudioTranscript } from '../../entities/audio-transcript.entity';
import { AudioTypes } from '../../entities/audio-types.entity';
import { Audio } from '../../entities/audio.entity';
import { AudiosToTopics } from '../../entities/audios-to-topics.entity';
import { AudioThumbnailDto } from './audio-thumbnail.dto';

class AudioItem {
  id: number;
  audioCode: string;
  audioType: AudioTypes;
  title: string;
  desc: string;
  audioThumbnail: AudioThumbnailDto;
  audioTranscripts: AudioTranscript[];
  audioHighlightWords: AudioHighlightWords[];
  audiosToTopics: AudiosToTopics[];
  level: Level;
}

export class AudioListResDto extends PaginationResultDto {
  items: AudioItem[];
}
