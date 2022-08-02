import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { FirebaseAuthorGuard } from '../../casl/guard/firebase-author.guard';
import { RequiredRule } from '../../casl/interfaces/requiredRule.interface';
import { ABILITY_METADATA_KEY } from '../constants/global.constant';

export const CheckAbility = (...requirements: RequiredRule[]) => {
  return applyDecorators(
    UseGuards(FirebaseAuthorGuard),
    SetMetadata(ABILITY_METADATA_KEY, requirements),
    ApiBearerAuth(),
  );
};
