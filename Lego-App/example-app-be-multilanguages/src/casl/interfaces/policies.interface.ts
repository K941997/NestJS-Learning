import { Resource, ActionAbility, Action } from '../../common/enums/global.enum';

export interface IPolicies {
  action: Action;
  resource: Resource;
  actionAbility: ActionAbility;
}
