import { EntityRepository, Repository } from 'typeorm';
import { NotFoundExc } from '../../common/exceptions/custom.exception';
import { Policies } from '../entities/policies.entity';

@EntityRepository(Policies)
export class PoliciesRepository extends Repository<Policies> {
  async getPoliciesByIdsAndCheckErr(policiesIds: number[]) {
    //  Get all policies
    const promises: Promise<Policies>[] = [];
    policiesIds.forEach((policiesId) =>
      promises.push(this.findOne(policiesId)),
    );
    const policiesEntities = await Promise.all(promises);
    //  Check policies exist
    policiesEntities.forEach((policiesEntity) => {
      if (!policiesEntity) throw new NotFoundExc('Policies not found');
    });
    return policiesEntities;
  }
}
