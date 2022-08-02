import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { TimestampWithoutSoftDeleteEntity } from '../../common/entities/base.entity';
import { GroupToPolicies } from './group-to-policies.entity';
import { UserToGroupPolicies } from './user-to-group-policies.entity';

@Entity({ name: 'group_policies' })
export class GroupPolicies extends TimestampWithoutSoftDeleteEntity {
  @PrimaryColumn()
  key: string;

  @Column({ unique: true })
  name: string;

  @Column()
  description: string;

  @OneToMany(
    () => GroupToPolicies,
    (groupToPolicies) => groupToPolicies.groupPolicies,
    { cascade: ['insert'] },
  )
  groupToPolicies: GroupToPolicies[];

  @OneToMany(
    () => UserToGroupPolicies,
    (userToGroupPolicies) => userToGroupPolicies.groupPolicies,
    {
      cascade: ['insert'],
    },
  )
  userToGroupPolicies: UserToGroupPolicies[];
}
