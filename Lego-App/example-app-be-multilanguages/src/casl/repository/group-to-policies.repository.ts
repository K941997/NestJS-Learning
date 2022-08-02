import { EntityRepository, Repository } from 'typeorm'
import { GroupToPolicies } from '../entities/group-to-policies.entity'

@EntityRepository(GroupToPolicies)
export class GroupToPoliciesRepository extends Repository<GroupToPolicies> {}
