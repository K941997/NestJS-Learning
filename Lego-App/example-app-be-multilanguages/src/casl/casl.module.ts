import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from '../user/repository/user.repository';
import { CaslAbilityFactory } from './casl-ability.factory';
import { CaslController } from './casl.controller';
import { CaslService } from './casl.service';
import { GroupPoliciesRepository } from './repository/group-policies.repository';
import { GroupToPoliciesRepository } from './repository/group-to-policies.repository';
import { PoliciesRepository } from './repository/policies.repository';
import { UserToGroupPoliciesRepository } from './repository/user-to-group-policies.repository';
import { FirebaseCaslStrategy } from './strategy/firebase-casl.strategy';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserRepository,
      GroupPoliciesRepository,
      GroupToPoliciesRepository,
      PoliciesRepository,
      UserToGroupPoliciesRepository,
    ]),
  ],
  controllers: [CaslController],
  providers: [CaslService, CaslAbilityFactory, FirebaseCaslStrategy],
  exports: [CaslAbilityFactory, CaslService],
})
export class CaslModule {}
