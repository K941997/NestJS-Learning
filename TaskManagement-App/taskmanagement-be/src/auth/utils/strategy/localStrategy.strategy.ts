/* eslint-disable prettier/prettier */
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from 'passport-local';
import { AuthService } from "../../auth.service";
import { AuthCredentialsDto } from "../../dto/authCredentials.dto";
import { UserEntity } from "../../entity/user.entity";
import { UserRepository } from "../../user.repository";


//!LocalStrategy: (for Login)
//Todo: LocalStrategy to LocalAuthGuard:
//Todo: JWT Access_Token (for Login):
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) { 
    constructor(
        private  authService: AuthService
    ) {
        super({
            usernameField: 'username' //Có thể là usernameField: 'email'
        });
    }

    async validate(username: string, password: string): Promise<any> {
        const user = await this.authService.validateUser(username, password);
        if (!user) {
          throw new UnauthorizedException("User không tồn tại");
        }
        return user;
    }
}