import {
  applyDecorators,
  createParamDecorator,
  ExecutionContext,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { FirebaseAuthenGuard } from '../../auth/guard/firebase-authen.guard';

export const Authenticate = () =>
  applyDecorators(UseGuards(FirebaseAuthenGuard), ApiBearerAuth());

export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
