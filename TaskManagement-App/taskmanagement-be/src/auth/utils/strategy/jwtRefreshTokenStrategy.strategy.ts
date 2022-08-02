/* eslint-disable prettier/prettier */
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { TokenPayload } from '../../interface/tokenPayload.interface';

import * as dotenv from 'dotenv';
import { UserRepository } from 'src/auth/user.repository';
import { InjectRepository } from '@nestjs/typeorm';
dotenv.config()
 
//!JwtRefreshToken: (For Refresh)
@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token'
) {
  constructor(
    private readonly authService: AuthService,
    @InjectRepository(UserRepository) //!@InjectRepository: đưa UserRepository vào Service
    private userRepository: UserRepository, //!private: vừa khai báo vừa injected vừa khởi tạo
  ) {
    super({
      //Cách 1:
      jwtFromRequest: ExtractJwt.fromExtractors([(request: Request) => {
        return request?.cookies?.Refresh;
      }]),
      secretOrKey: process.env.JWT_REFRESH_TOKEN_SECRET,
      passReqToCallback: true,

      //Cách 2:
      // jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // secretOrKey: process.env.JWT_REFRESH_TOKEN_SECRET,
      // passReqToCallback: true,
    });
  }
 
  //Cách 1:
  async validate(request: Request, payload: any) {
    console.log("Đang vào JwtStrategyRefreshToken...")
    
    console.log(payload, "Payload in JwtStrategyRefreshToken")

    const refreshToken = request.cookies?.Refresh;
    console.log(refreshToken, "RefreshToken in JwtStrategyRefreshToken")

    return this.authService.getUserIfRefreshTokenMatches(refreshToken, payload.userId);
  }

  //Cách 2:
  // async validate(req: Request, payload: any) {
  //   console.log(payload, "payload JwtRefreshTokenStrategy")

  //   const refreshToken = req
  //     ?.get('authorization')
  //     ?.replace('Bearer', '')
  //     .trim();
  //   console.log(refreshToken, "Refresh Token JwtRefreshTokenStrategy")

  //   return {
  //     ...payload,
  //     refreshToken,
  //   };
  // }
}