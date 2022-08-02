import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { GroupPolicies } from './group-policies.entity';
import { Policies } from './policies.entity';

@Entity({ name: 'group_to_policies' })
export class GroupToPolicies {
  // Column join to be primary key
  @PrimaryColumn({ name: 'policies_id' })
  policiesId: number;

  @PrimaryColumn({ name: 'group_policies_key' })
  groupPoliciesKey: string;

  @ManyToOne(() => Policies, (policies) => policies.groupToPolicies, {
    onDelete: 'CASCADE',
    cascade: ['insert'],
  })
  @JoinColumn({ name: 'policies_id' })
  policies: Policies;

  @ManyToOne(
    () => GroupPolicies,
    (groupPolicies) => groupPolicies.groupToPolicies,
    { onDelete: 'CASCADE', cascade: ['insert'] },
  )
  @JoinColumn({ name: 'group_policies_key' })
  groupPolicies: GroupPolicies;
}
