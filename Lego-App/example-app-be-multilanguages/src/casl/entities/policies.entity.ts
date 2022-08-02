import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { NameConstraintEntity } from '../../common/constants/global.constant';
import {
  Resource,
  ActionAbility,
  Action,
} from '../../common/enums/global.enum';
import { GroupToPolicies } from './group-to-policies.entity';

@Entity()
@Unique(NameConstraintEntity.UQ_POLICIES, [
  'action',
  'resource',
  'actionAbility',
])
export class Policies {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: Action })
  action: Action;

  @Column({ type: 'enum', enum: Resource })
  resource: Resource;

  @Column({ type: 'enum', enum: ActionAbility, name: 'action_ability' })
  actionAbility: ActionAbility;

  @Column({ unique: true })
  name: string;

  @OneToMany(
    () => GroupToPolicies,
    (groupToPolicies) => groupToPolicies.policies,
    { cascade: ['insert'] },
  )
  groupToPolicies: GroupToPolicies[];
}
