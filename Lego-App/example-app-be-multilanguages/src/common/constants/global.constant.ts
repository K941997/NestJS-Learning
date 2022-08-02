export const ABILITY_METADATA_KEY = 'ability';
export enum PrefixType {
  ADMIN = 'admin',
  CLIENT = 'client',
}

export enum FileType {
  IMAGE = 'images',
  PDF = 'pdf',
  AUDIO = 'audio',
}

export enum SupportFileType {
  png = 'png',
  jpg = 'jpg',
  jpeg = 'jpeg',
  pdf = 'pdf',
  mp3 = 'mp3',
  mp4 = 'mp4',
  wav = 'wav',
}

export enum SupportedAudioFileType {
  mp3 = 'mp3',
  mp4 = 'mp4',
  wav = 'wav',
}

export enum BooleanEnum {
  TRUE = 1,
  FALSE = -1,
}

export const MapFilePathSupport = [
  {
    key: FileType.IMAGE,
    types: ['png', 'jpg', 'jpeg'],
  },
  {
    key: FileType.PDF,
    types: ['pdf'],
  },
  {
    key: FileType.AUDIO,
    types: ['mp3', 'mp4', 'wav'],
  },
];

export enum AudioType {
  INTERNET = 'internet',
  UPLOADED = 'uploaded',
}

export enum TranscriptionJobStatus {
  COMPLETED = 'COMPLETED',
  INPROGRESS = 'IN_PROGRESS',
}

export const KEY_LANG_HEADER = 'lang';
export enum LangEnum {
  En = 'en',
  Vi = 'vi',
}

// Paginate data
export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 20;

// Constraint name for entity
export enum NameConstraintEntity {
  UQ_LEVEL_TRANSLATE_1 = 'UQ_LEVEL_TRANSLATE_1',
  CHK_LEVEL_TRANSLATE_1 = 'CHK_LEVEL_TRANSLATE_1',
  UQ_TOPIC_TRANSLATE_1 = 'UQ_TOPIC_TRANSLATE_1',
  CHK_TOPIC_TRANSLATE_1 = 'CHK_TOPIC_TRANSLATE_1',
  UQ_VIDEO_CODE = 'UQ_VIDE_CODE',
  UQ_POLICIES = 'UQ_POLICIES',
  UQ_USER_HIGHLIGHT_WORDS = 'UQ_USER_HIGHLIGHT_WORDS',
  CHECK_USER_HIGHLIGHT_WORDS = 'CHECK_USER_HIGHLIGHT_WORDS',
}

// Prefix file translate
export const MAIN_LANG = 'main';
export const ENTITY_LANG = 'entity';

export const SEEDED_LEVEL_KEY = 'test level';
