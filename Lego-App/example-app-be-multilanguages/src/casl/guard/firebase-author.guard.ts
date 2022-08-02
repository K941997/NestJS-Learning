import { ForbiddenError } from '@casl/ability';
import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { ABILITY_METADATA_KEY } from '../../common/constants/global.constant';
import { ForbiddenExc } from '../../common/exceptions/custom.exception';
import { CaslAbilityFactory } from '../casl-ability.factory';
import { UserWithPoliciesDto } from '../dto/transform/userWithPolicies.dto';
import { RequiredRule } from '../interfaces/requiredRule.interface';

@Injectable()
export class FirebaseAuthorGuard extends AuthGuard('firebase-casl') {
  constructor(
    private reflector: Reflector,
    private abilityFactory: CaslAbilityFactory,
  ) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const rules = this.reflector.getAllAndOverride<RequiredRule[]>(
      ABILITY_METADATA_KEY,
      [context.getHandler(), context.getClass()],
    );

    // If has rules metadata then authenticate to get user
    if (!rules?.length) return true;

    return super.canActivate(context);
  }

  handleRequest(
    err: any,
    user: UserWithPoliciesDto,
    info: any,
    context: ExecutionContext,
  ) {
    if (info instanceof Error || !user || err) throw new ForbiddenExc();

    const rules = this.reflector.getAllAndOverride<RequiredRule[]>(
      ABILITY_METADATA_KEY,
      [context.getHandler(), context.getClass()],
    );

    const ability = this.abilityFactory.defineAbility(user);

    try {
      rules.forEach((rule) => {
        ForbiddenError.from(ability).throwUnlessCan(rule.action, rule.subject);
      });
      return user as any;
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }
}
