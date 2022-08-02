import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { plainToClass, plainToInstance } from 'class-transformer';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

type ClassContructor = {
  new (...args: any[]): any;
};

/**
 * Use this function to manual convert data of dto
 * using @Exclude, @Expose, @Transform....
 */

export function ManualSerialize(dto: ClassContructor) {
  return UseInterceptors(new ManulSerializeInterceptor(dto));
}

class ManulSerializeInterceptor implements NestInterceptor {
  constructor(private dto: ClassContructor) {}

  intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
    return handler.handle().pipe(map((data) => plainToClass(this.dto, data)));
  }
}
interface ClassConstructor {
  new (...args: any[]): {};
}

export function Serialize(dto: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: ClassConstructor) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      map((data) => {
        return plainToInstance(this.dto, data, {});
      }),
    );
  }
}
