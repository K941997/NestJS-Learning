import * as mainJson from '../../i18n/en/main.json';
import { ENTITY_LANG, MAIN_LANG } from '../constants/global.constant';
/**
 * If you update file localize, it will not effect immidiately
 * You need to shutdown vs code and restart it again, some cache issue here.
 */
const langData = {
  [MAIN_LANG]: { ...mainJson },
};

type PathsToStringProps<T> = T extends string
  ? []
  : {
      [K in Extract<keyof T, string>]: [K, ...PathsToStringProps<T[K]>];
    }[Extract<keyof T, string>];

type Join<T extends string[], D extends string> = T extends []
  ? never
  : T extends [infer F]
  ? F
  : T extends [infer F, ...infer R]
  ? F extends string
    ? `${F}${D}${Join<Extract<R, string[]>, D>}`
    : never
  : string;

export type DottedLanguageObjectStringPaths = Join<
  PathsToStringProps<typeof langData>,
  '.'
>;
