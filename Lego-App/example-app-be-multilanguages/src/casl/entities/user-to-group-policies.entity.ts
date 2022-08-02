import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { GroupPolicies } from './group-policies.entity';

@Entity({ name: 'user_to_group_policies' })
export class UserToGroupPolicies {
  @PrimaryColumn({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => User, (user) => user.userToGroupPolicies, {
    onDelete: 'CASCADE',
    cascade: ['insert'],
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @PrimaryColumn({ name: 'group_policies_key' })
  groupPoliciesKey: string;

  @ManyToOne(
    () => GroupPolicies,
    (groupPolicies) => groupPolicies.userToGroupPolicies,
    { onDelete: 'CASCADE', cascade: ['insert'] },
  )
  @JoinColumn({ name: 'group_policies_key' })
  groupPolicies: GroupPolicies;
}
