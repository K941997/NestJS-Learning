import { IAudioTranscriptWord } from '../../audio/interfaces/audio-transcript-content.interface';

interface IAlternatives {
  confidence: string;
  content: string;
}

export interface ITranscriptItem {
  start_time?: string;
  end_time?: string;
  alternatives: IAlternatives[];
  type: 'pronunciation' | 'punctuation';
}

export interface ITranscriptBeatified {
  audio_id: number;
  content: IAudioTranscriptWord[];
  start_time?: string;
}

// Use this function to beatify data for saving transcript.
export const beautifyTranscript = (
  audioId: number,
  items: ITranscriptItem[],
) => {
  if (items.length === 0) {
    return [];
  }
  const result: ITranscriptBeatified[] = [];
  let currentTranscriptItem: ITranscriptBeatified = {
    audio_id: audioId,
    content: [],
  };
  for (let i = 0; i < items.length; i++) {
    const { start_time, alternatives, type } = items[i];
    const { content } = alternatives[0];

    // rules:
    // 1. if type is punctuation, time gap is more than 2s then break into new section.
    // 2. if type is punctuation, content is '.' then break into new section.

    // calculate the length of the content
    let currentLength = 0;
    for (const sectionContent of currentTranscriptItem.content) {
      for (const wordContent of sectionContent.content) {
        currentLength += wordContent.length;
      }
    }

    if (
      (type === 'punctuation' &&
        i > 0 &&
        parseFloat(items[i + 1]?.start_time) >
          parseFloat(items[i - 1]?.end_time) + 2) ||
      (type === 'punctuation' && content === '.' && currentLength > 270)
    ) {
      currentTranscriptItem.content.push({
        content,
        type,
        start_time,
      });
      result.push(currentTranscriptItem);
      currentTranscriptItem = {
        audio_id: audioId,
        content: [],
      };
    } else {
      currentTranscriptItem.content.push({
        content,
        type,
        start_time,
      });
      currentTranscriptItem.start_time = currentTranscriptItem.start_time
        ? currentTranscriptItem.start_time
        : start_time;
    }
  }
  return result;
};
