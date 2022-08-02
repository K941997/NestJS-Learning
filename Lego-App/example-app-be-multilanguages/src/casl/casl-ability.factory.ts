import { Ability, AbilityBuilder, AbilityClass } from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { Action, ActionAbility, Resource } from '../common/enums/global.enum';
import { UserWithPoliciesDto } from './dto/transform/userWithPolicies.dto';
import { IPolicies } from './interfaces/policies.interface';

export type Subjects = Resource | 'all';

export type AppAbility = Ability<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  defineAbility(user: UserWithPoliciesDto) {
    const { can, cannot, build } = new AbilityBuilder(
      Ability as AbilityClass<AppAbility>,
    );

    //  Cannot will overwrite can so we just need loop through can
    //  And we loop through cannot to overwrite can
    user.policies.forEach((policy: IPolicies) => {
      if (policy.actionAbility === ActionAbility.CAN) {
        can(policy.action, policy.resource);
      }
    });

    user.policies.forEach((policy: IPolicies) => {
      if (policy.actionAbility === ActionAbility.CANNOT) {
        cannot(policy.action, policy.resource);
      }
    });

    return build();
  }
}
