import { Injectable } from '@nestjs/common';
import { PaginateDto } from '../common/dto/req/paginate.dto';
import { UserTypeKey } from '../common/enums/global.enum';
import {
  ConflictExc,
  NotFoundExc,
} from '../common/exceptions/custom.exception';
import { parseOffsetAndLimit } from '../common/helpers/paginate.helper';
import { UserRepository } from '../user/repository/user.repository';
import { CreateGroupPolicyDto } from './dto/req/create-group-policies.dto';
import { DeleteManyGroupPoliciesDto } from './dto/req/delete-many-group-policies.dto';
import { UpdateGroupPoliciesDto } from './dto/req/update-group-policies.dto';
import { GroupPoliciesRepository } from './repository/group-policies.repository';
import { GroupToPoliciesRepository } from './repository/group-to-policies.repository';
import { PoliciesRepository } from './repository/policies.repository';
import { UserToGroupPoliciesRepository } from './repository/user-to-group-policies.repository';

@Injectable()
export class CaslService {
  constructor(
    private userRepo: UserRepository,
    private groupPoliciesRepo: GroupPoliciesRepository,
    private policiesRepo: PoliciesRepository,
    private groupToPoliciesRepo: GroupToPoliciesRepository,
    private userToGroupPoliciesRepo: UserToGroupPoliciesRepository,
  ) {}

  async createGroupPolicies(reqData: CreateGroupPolicyDto) {
    const { description, name, policiesIds } = reqData;
    const groupPoliciesKey = this.groupPoliciesRepo.transfromNameToKey(name);

    //  Check Group Policies exist
    const existGroupPolicies = await this.groupPoliciesRepo.findOne(
      groupPoliciesKey,
    );
    if (existGroupPolicies)
      throw new ConflictExc(
        'Group policies name is in use or key has been taken',
      );

    //  Check policies exist
    await this.policiesRepo.getPoliciesByIdsAndCheckErr(policiesIds);

    // Use TypeOrm cascade to insert groupToPolicies
    const groupToPolicies = policiesIds.map((policiesId) =>
      this.groupToPoliciesRepo.create({
        groupPoliciesKey,
        policiesId,
      }),
    );
    const groupPolicies = this.groupPoliciesRepo.create({
      description,
      groupToPolicies,
      key: groupPoliciesKey,
      name,
    });

    await this.groupPoliciesRepo.save(groupPolicies);
    return groupPolicies;
  }

  async getAllGroupPolicies(query: PaginateDto) {
    const { limit, offset } = parseOffsetAndLimit(query.page, query.limit);
    return this.groupPoliciesRepo
      .createQueryBuilder('group_policies')
      .loadRelationCountAndMap(
        'group_policies.totalMem',
        'group_policies.userToGroupPolicies',
      )
      .skip(offset)
      .take(limit)
      .getMany();
  }

  async getGroupPoliciesByKey(key: string) {
    const groupPolicies = await this.groupPoliciesRepo
      .createQueryBuilder('group_policies')
      .where('group_policies.key = :key', { key })
      .leftJoinAndSelect('group_policies.groupToPolicies', 'group_to_policies')
      .leftJoinAndSelect('group_to_policies.policies', 'policies')
      .loadRelationCountAndMap(
        'group_policies.totalMem',
        'group_policies.userToGroupPolicies',
      )
      .getOne();
    if (!groupPolicies) throw new NotFoundExc('Group policies not found');
    return groupPolicies;
  }

  async updateGroupPolicies(reqData: UpdateGroupPoliciesDto) {
    const { description, key, name, policiesIds } = reqData;

    //  Check policies exist
    await this.policiesRepo.getPoliciesByIdsAndCheckErr(policiesIds);

    const groupPolicies = await this.groupPoliciesRepo.findOne(key);
    if (!groupPolicies) throw new NotFoundExc('Group policies not found');

    const groupToPolicies = policiesIds.map((policiesId) =>
      this.groupToPoliciesRepo.create({
        groupPoliciesKey: key,
        policiesId,
      }),
    );

    this.groupToPoliciesRepo.delete({
      groupPoliciesKey: key,
    });

    groupPolicies.description = description;
    groupPolicies.name = name;
    groupPolicies.groupToPolicies = groupToPolicies;

    await this.groupPoliciesRepo.save(groupPolicies);
    const groupPoliciesReturn = await this.getGroupPoliciesByKey(key);
    return groupPoliciesReturn;
  }

  async deleteManyGroupPolicies(reqData: DeleteManyGroupPoliciesDto) {
    const { groupPoliciesKeys } = reqData;
    const { affected } = await this.groupPoliciesRepo.delete(groupPoliciesKeys);
    return affected;
  }

  async deleteGroupPolicies(key: string) {
    const groupPolicies = await this.groupPoliciesRepo.findOne(key);
    if (!groupPolicies) throw new NotFoundExc('Group policies not found');
    await this.groupPoliciesRepo.remove(groupPolicies);
  }

  // This function is used by jwt-casl.strategy.ts
  async getUserWithPolicies(uid: string) {
    const user = await this.userRepo
      .createQueryBuilder('users')
      .leftJoinAndSelect('users.userToGroupPolicies', 'user_to_group_policies')
      .leftJoinAndSelect(
        'user_to_group_policies.groupPolicies',
        'group_policies',
      )
      .leftJoinAndSelect('group_policies.groupToPolicies', 'group_to_policies')
      .leftJoinAndSelect('group_to_policies.policies', 'policies')
      .where('users.firId = :uid', {
        uid,
      })
      .andWhere('users.userType = :userTypeKey', {
        userTypeKey: UserTypeKey.ADMIN,
      })
      .getOne();
    return user;
  }

  async getAllPolicies() {
    return this.policiesRepo.find();
  }
}
