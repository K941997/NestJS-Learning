import { Expose, Transform } from 'class-transformer';
import { UserResDTO } from '../../../user/dto/res/user.dto';
import { User } from '../../../user/entities/user.entity';
import { IPolicies } from '../../interfaces/policies.interface';

export class UserWithPoliciesDto extends UserResDTO {
  @Expose()
  @Transform(({ obj }: { obj: User }) => {
    return obj.userToGroupPolicies.reduce(
      (result: IPolicies[], userToGroupPoliciesItem) => {
        userToGroupPoliciesItem?.groupPolicies?.groupToPolicies?.forEach(
          (groupToPoliciesItem) => {
            const policy: IPolicies = {
              action: groupToPoliciesItem.policies.action,
              resource: groupToPoliciesItem.policies.resource,
              actionAbility: groupToPoliciesItem.policies.actionAbility,
            };
            const isConflict = result.some(
              (item) =>
                item.action === policy.action &&
                item.resource === policy.resource &&
                item.actionAbility === policy.actionAbility,
            );
            if (!isConflict) {
              result.push(policy);
            }
          },
        );
        return result;
      },
      [],
    );
  })
  policies: IPolicies[];
}
