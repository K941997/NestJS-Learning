/* eslint-disable prettier/prettier */
import { SetMetadata } from "@nestjs/common";
import { Action } from "./casl-action.enum";
import { Subjects } from "./casl-ability.factory";
import { PolicyHandler } from "./policyhandler.handler";

//!Advanced CASL: Implementing a PoliciesGuard:
// export interface RequiredRule {
//   action: Action;
//   subject: Subjects;
// } 

export const CHECK_POLICIES_KEY = 'check_policy';
export const CheckPolicies = (...handlers: PolicyHandler[]) =>
  SetMetadata(CHECK_POLICIES_KEY, handlers);