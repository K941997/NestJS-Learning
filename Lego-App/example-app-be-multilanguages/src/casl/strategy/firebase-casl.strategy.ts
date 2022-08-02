import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { plainToInstance } from 'class-transformer';
import { ExtractJwt, Strategy } from 'passport-firebase-jwt';
import { CaslService } from '../casl.service';
import { UserWithPoliciesDto } from '../dto/transform/userWithPolicies.dto';
import * as firebase from 'firebase-admin';

@Injectable()
export class FirebaseCaslStrategy extends PassportStrategy(
  Strategy,
  'firebase-casl',
) {
  constructor(private caslService: CaslService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(token: string): Promise<UserWithPoliciesDto | false> {
    const firebaseUser: any = await firebase
      .auth()
      .verifyIdToken(token, true)
      .catch((err) => {
        throw new UnauthorizedException(err.message);
      });
    if (!firebaseUser) {
      throw new UnauthorizedException();
    }
    const user = await this.caslService.getUserWithPolicies(firebaseUser.uid);
    const userWithPolicies = plainToInstance(UserWithPoliciesDto, user);
    if (!userWithPolicies) return false;
    return userWithPolicies;
  }
}
