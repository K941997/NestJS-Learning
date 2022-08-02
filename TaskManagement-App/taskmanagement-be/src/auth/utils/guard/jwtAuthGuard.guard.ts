/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

//!JwtAuthGuard:
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') { 
    //Todo: JWTStrategy Bearer Token (for Protected after Login):
    //!Remove SessionCookie to Use Guard JWTToken return access_token = BearerToken check SessionCookie:
    
}