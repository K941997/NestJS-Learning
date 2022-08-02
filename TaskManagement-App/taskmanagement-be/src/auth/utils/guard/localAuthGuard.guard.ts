/* eslint-disable prettier/prettier */
import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

//!Guard:
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
    //Todo: LocalStrategy JWT Access_Token (for Login):
    //!Remove Session Cookie to Use Guard JWT Token return access_token check Session Cookie:
    // async canActivate(context: ExecutionContext) { //!SessionCookies
    //     const result = (await super.canActivate(context)) as boolean;
    //     const request = context.switchToHttp().getRequest();
        
    //     await super.logIn(request);
    //     return result;
    // }

}
