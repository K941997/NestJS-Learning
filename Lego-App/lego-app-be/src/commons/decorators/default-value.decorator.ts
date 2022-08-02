import { Expose, Transform, TransformOptions } from 'class-transformer';

export function Default(
  defaultValue: any,
  options?: TransformOptions,
): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol): void {
    Transform(() => defaultValue, options)(target, propertyKey);
    Expose()(target, propertyKey);
  };
}
