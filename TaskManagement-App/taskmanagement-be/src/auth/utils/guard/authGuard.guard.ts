/* eslint-disable prettier/prettier */
import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";


//todo: Remove Session Cookie to Use Guard JWT Token return access_token check Session Cookie: 
// @Injectable()
// export class AuthenticatedGuard implements CanActivate { //!SessionCookies
//     async canActivate(context: ExecutionContext) {
//         const request = context.switchToHttp().getRequest();

//         return request.isAuthenticated();
//     }
// }