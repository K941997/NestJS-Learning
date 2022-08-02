import { EntityRepository, Repository } from 'typeorm';
import { EvDict } from '../entities/ev_dict.entity';

@EntityRepository(EvDict)
export class EvDictRepository extends Repository<EvDict> {}
