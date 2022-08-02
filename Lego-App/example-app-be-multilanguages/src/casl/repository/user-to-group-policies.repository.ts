import { EntityRepository, Repository } from 'typeorm';
import { UserToGroupPolicies } from '../entities/user-to-group-policies.entity';

@EntityRepository(UserToGroupPolicies)
export class UserToGroupPoliciesRepository extends Repository<UserToGroupPolicies> {
  // async getUserPoliciesKey(userId: number) {
  //   return this.createQueryBuilder('user_to_group_policies')
  //     .innerJoinAndSelect(
  //       'user_to_group_policies.groupPolicies',
  //       'group_policies',
  //     )
  //     .innerJoinAndSelect('group_policies.groupToPolicies', 'group_to_policies')
  //     .innerJoinAndMapMany(
  //       'user.test',
  //       'group_to_policies.policies',
  //       'policies',
  //     )
  //     .where('user_to_group_policies.userId = :userId', { userId })
  //     .getOne();
  // }
}
