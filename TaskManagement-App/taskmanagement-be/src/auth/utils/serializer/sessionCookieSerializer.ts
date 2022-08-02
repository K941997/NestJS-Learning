/* eslint-disable prettier/prettier */
import { Inject } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { AuthService } from '../../auth.service';
import { UserEntity } from '../../entity/user.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SessionCookieSerializer extends PassportSerializer {

  //!SessionCookies:  
  serializeUser(user: any, done: (err: Error, user: any) => void): any {
    done(null, user);
  }

  deserializeUser(payload: any, done: (err: Error, payload: string) => void): any {   
    done(null, payload)
  }

 
}
