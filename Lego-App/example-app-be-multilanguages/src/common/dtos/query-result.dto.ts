import { ApiExtraModels, PartialType } from '@nestjs/swagger';
import { QueryResult } from 'typeorm';

// For swagger
@ApiExtraModels()
export class QueryResultDto extends PartialType(QueryResult) {
  affected?: number;
}
