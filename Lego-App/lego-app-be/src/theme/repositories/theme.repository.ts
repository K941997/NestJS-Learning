import { Injectable } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { ThemeEntity } from './../entities/theme.entity';

@Injectable()
export class ThemeRepository extends Repository<ThemeEntity> {
  constructor(private dataSource: DataSource) {
    super(ThemeEntity, dataSource.createEntityManager());
  }
}
