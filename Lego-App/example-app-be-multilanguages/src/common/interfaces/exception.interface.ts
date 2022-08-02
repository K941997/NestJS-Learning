import { DottedLanguageObjectStringPaths } from './translate.interface';

export type IException = {
  key: DottedLanguageObjectStringPaths;
  args?: Record<string, any>;
  data?: Record<string, any>;
};
