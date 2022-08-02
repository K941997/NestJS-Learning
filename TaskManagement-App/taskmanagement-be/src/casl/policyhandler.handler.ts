/* eslint-disable prettier/prettier */
import { AppAbility } from '../casl/casl-ability.factory';

//!Advanced CASL: Implementing a PoliciesGuard:
//todo: Chưa Custom nên không dùng được:
interface IPolicyHandler {
  handle(ability: AppAbility): boolean;
}

type PolicyHandlerCallback = (ability: AppAbility) => boolean;

export type PolicyHandler = IPolicyHandler | PolicyHandlerCallback;