/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from 'src/auth/user.repository';
import * as dotenv from 'dotenv';
dotenv.config()


//!Access Token: 
//!JWTStrategy: (for CRUD after Login)
//Todo: JwtStrategy to JwtAuthGuard:
//Todo: Bearer Token (for Protected after Login):
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') { 
  constructor(
    @InjectRepository(UserRepository) //!@InjectRepository: đưa UserRepository vào Service
    private userRepository: UserRepository, //!private: vừa khai báo vừa injected vừa khởi tạo
  ) {
    super({
      //!JWTToken BearerToken:
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET_KEY, //protect move to .env, secretKey in auth.module //!Thiếu dotenv.config()
      ignoreExpiration: false, //Không lựa chọn bỏ qua Token hết hạn
      // passReqToCallback:true
    });
  }

  async validate(payload: any){ //todo: payload from jwttoken AccessToken in auth.Service
    const user = await this.userRepository.find({id: payload.sub});
 
    if (!user) {
      throw new UnauthorizedException()
  }
    // return { user, id: payload.sub, role: payload.role, isAdmin: payload.isAdmin };
    return user;
  }

}
