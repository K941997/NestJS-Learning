/* eslint-disable prettier/prettier */
import { UserEntity } from '../entity/user.entity';
import { Request } from 'express';

export interface RequestWithUser extends Request { //!Dùng trong Task Controller
  user: UserEntity; //"user": {"username": "", "password": ""}
}
