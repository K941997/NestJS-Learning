import { Action } from '../../common/enums/global.enum';
import { Subjects } from '../casl-ability.factory';

export interface RequiredRule {
  action: Action;
  subject: Subjects;
}
