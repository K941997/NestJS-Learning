/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserRepository } from './user.repository';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { SessionCookieSerializer } from './utils/serializer/sessionCookieSerializer';
import { JwtStrategy } from './utils/strategy/jwtStrategy.strategy';
import { UserEntity } from './entity/user.entity';
import { LocalStrategy } from './utils/strategy/localStrategy.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from './utils/guard/jwtAuthGuard.guard';
import { RolesGuard } from './role/roleGuard.guard';
import { CaslModule } from 'src/casl/casl.module';
import { MongooseModule } from '@nestjs/mongoose';
import * as dotenv from 'dotenv';
import { JwtRefreshTokenStrategy } from './utils/strategy/jwtRefreshTokenStrategy.strategy';
import JwtRefreshTokenGuard from './utils/guard/jwtRefreshTokenGuard.guard';
import FirebaseJwtStrategy from 'passport-firebase-jwt/dist/strategy';
dotenv.config()

// const passportModule = PassportModule.register({ defaultStrategy: 'jwt' });


@Module({
  imports: [
    PassportModule,

    PassportModule.register({ //!Remove SessionCookie to Use Guard JWTToken return access_token = BearerToken check SessionCookie:
      defaultStrategy: 'jwt',
      // session: true,
    }), 

    JwtModule.register({ //!JWTModule register to use Guard JWTToken return access_token = BearerToken check SessionCookie
      secret: process.env.JWT_SECRET_KEY, //protect move to .env, fill in jwtStrategy //!Thiếu dotenv.config()
      signOptions: {
        expiresIn: process.env.JWT_TIME_EXPIRES_IN,
      },
    }),


    TypeOrmModule.forFeature([UserRepository]),

    CaslModule,
   
    
  ],

  // providers: [AuthService, JwtStrategy, LocalStrategy, SessionCookieSerializer], //!SessionCookies
  providers: [
    AuthService, 
    LocalStrategy,
    JwtStrategy, JwtAuthGuard,
    RolesGuard,
    JwtRefreshTokenStrategy, JwtRefreshTokenGuard,
  ], //!JWT Remove SessionCookies, RolesGuard RBAC not CASL

  controllers: [AuthController],

  exports: [AuthService, PassportModule], //JwtStrategy Guards


})
export class AuthModule {}
