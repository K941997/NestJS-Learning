import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDefined,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  Min,
  Max,
  Matches,
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  ArrayMinSize,
  ArrayMaxSize,
  IsDate,
  MinDate,
  ArrayUnique,
  IsEnum,
  IsNotEmpty,
  matches,
  maxLength,
  minLength,
  ValidateNested,
  IsArray,
  UUIDVersion,
  IsUUID,
} from 'class-validator';
import { getValEnumNumber, getValEnumStr } from '../utils';
import { Default } from './default-value.decorator';

type ValidationEnumOptions = {
  enum: Record<string, any>;
  required?: boolean;
};

export function IsValidEnum(opts: ValidationEnumOptions): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol): void {
    IsEnum(opts.enum)(target, propertyKey);
    if (opts.required === false) IsOptional()(target, propertyKey);
    else IsNotEmpty()(target, propertyKey);
  };
}

/**
 * Validate Number is valid
 */
type ValidationDateOptions = {
  required?: boolean;
  minDate?: Date;
  maxDate?: Date;
};

export function IsValidDate(
  opts: ValidationDateOptions = {
    required: true,
  },
): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol): void {
    IsDate()(target, propertyKey);
    if (opts.minDate) MinDate(opts.minDate)(target, propertyKey);
    if (opts.maxDate) MinDate(opts.maxDate)(target, propertyKey);
    if (opts.required) IsDefined()(target, propertyKey);
    else IsOptional()(target, propertyKey);
  };
}

/**
 * Validate Number is valid
 */
type ValidationNumberOptions = {
  required?: boolean;
  min?: number;
  max?: number;
};

export function IsValidNumber(
  opts: ValidationNumberOptions = {
    required: true,
  },
): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol): void {
    IsNumber()(target, propertyKey);
    Type(() => Number)(target, propertyKey);
    if (opts.min) Min(opts.min)(target, propertyKey);
    if (opts.max) Max(opts.max)(target, propertyKey);
    if (opts.required) IsDefined()(target, propertyKey);
    else IsOptional()(target, propertyKey);
  };
}

/**
 * Validate text is valid
 */
type ValidationTextOptions = {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  matches?: RegExp;
};

export function IsValidText(
  { minLength, maxLength, required, matches }: ValidationTextOptions = {
    required: true,
    minLength: 1,
    maxLength: 255,
  },
): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol): void {
    ApiProperty()(target, propertyKey);
    IsString()(target, propertyKey);
    MinLength(minLength)(target, propertyKey);
    MaxLength(maxLength)(target, propertyKey);
    if (matches) Matches(matches)(target, propertyKey);
    if (required) IsNotEmpty()(target, propertyKey);
    else IsOptional()(target, propertyKey);
  };
}

/**
 * Validate uuid is valid
 */
type ValidationUUIDOptions = {
  required?: boolean;
  version?: UUIDVersion;
};

export function IsValidUUID(
  { required, version }: ValidationUUIDOptions = {
    required: true,
    version: '4',
  },
): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol): void {
    ApiProperty()(target, propertyKey);
    IsUUID(version)(target, propertyKey);
    if (required) IsNotEmpty()(target, propertyKey);
  };
}

/**
 * Validate object is valid
 */
type ValidationObjectOptions = {
  required?: boolean;
  object: { new (...args: any[]): any };
};

export function IsValidObject({
  object,
  required = true,
}: ValidationObjectOptions): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol): void {
    ApiProperty()(target, propertyKey);
    ValidateNested()(target, propertyKey);
    Type(() => object)(target, propertyKey);
    if (required) IsNotEmpty()(target, propertyKey);
    else IsOptional()(target, propertyKey);
  };
}

/**
 * Valid array of number
 */
type ValidationArrayOptions = {
  required?: boolean;
  minSize?: number;
  maxSize?: number;
  unique?: boolean;
};

// Dont know why default value min/max size array not work here.
export function IsValidArrayNumber(
  { required, minSize, maxSize, unique }: ValidationArrayOptions = {
    required: true,
    unique: true,
  },
): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol): void {
    IsNumber({}, { each: true })(target, propertyKey);
    ArrayMinSize(minSize || 1)(target, propertyKey);
    ArrayMaxSize(maxSize || 100)(target, propertyKey);
    if (unique) ArrayUnique()(target, propertyKey);
    if (required) IsDefined()(target, propertyKey);
    else IsOptional()(target, propertyKey);
  };
}

export function IsValidArrayString(
  { required, minSize, maxSize, unique }: ValidationArrayOptions = {
    required: true,
    unique: true,
  },
): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol): void {
    IsString({ each: true })(target, propertyKey);
    ArrayMinSize(minSize || 1)(target, propertyKey);
    ArrayMaxSize(maxSize || 100)(target, propertyKey);
    if (unique) ArrayUnique()(target, propertyKey);
    if (required) IsNotEmpty({ each: true })(target, propertyKey);
    else IsOptional()(target, propertyKey);
  };
}

/**
 * Validate array of object is valid
 */
export function IsValidArrayObject(
  { maxSize, minSize, required = true, unique = true }: ValidationArrayOptions,
  object: { new (...args: any[]): any },
): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol): void {
    ApiProperty()(target, propertyKey);
    IsArray()(target, propertyKey);
    ValidateNested({ each: true })(target, propertyKey);
    ArrayMinSize(minSize || 1)(target, propertyKey);
    ArrayMaxSize(maxSize || 100)(target, propertyKey);
    Type(() => object)(target, propertyKey);
    if (unique) ArrayUnique()(target, propertyKey);
    if (required) IsNotEmpty()(target, propertyKey);
    else IsOptional()(target, propertyKey);
  };
}

/**
 * Match two field
 */
export function MatchField(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [property],
      validator: MatchConstraint,
    });
  };
}

@ValidatorConstraint({ name: 'MatchField' })
export class MatchConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints;
    const relatedValue = (args.object as any)[relatedPropertyName];
    return value === relatedValue;
  }

  // maybe we can add default message here.
}

/**
 * Require all field exist
 */
export function ExcludeAllField(
  property: string[],
  validationOptions?: ValidationOptions,
) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: property,
      validator: ExcludeFieldConstraint,
    });
  };
}

@ValidatorConstraint({ name: 'ExcludeAllField' })
export class ExcludeFieldConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const constraints = args.constraints;
    for (const keyField of constraints) {
      const relatedValue = (args.object as any)[keyField];
      if (relatedValue) return false;
    }

    return true;
  }

  // maybe we can add default message here.
}

/**
 * Require all field exist
 */
export function RequireAllField(
  property: string[],
  validationOptions?: ValidationOptions,
) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: property,
      validator: RequireFieldConstraint,
    });
  };
}

@ValidatorConstraint({ name: 'RequireAllField' })
export class RequireFieldConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const constraints = args.constraints;
    for (const keyField of constraints) {
      const relatedValue = (args.object as any)[keyField];
      if (!relatedValue) return false;
    }

    return true;
  }

  // maybe we can add default message here.
}

/**
 * Require one of fields exist
 */
export function RequireOneOf(
  property: string[],
  validationOptions?: ValidationOptions,
) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: property,
      validator: RequireOneOfConstraint,
    });
  };
}

@ValidatorConstraint({ name: 'RequireOneOf' })
export class RequireOneOfConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const constraints = args.constraints;
    for (const keyField of constraints) {
      const relatedValue = (args.object as any)[keyField];
      if (relatedValue) return true;
    }

    return false;
  }

  // maybe we can add default message here.
}

/**
 * Just one of fields exist base on value
 */
interface IJustOneOfConstraint {
  enumValue: string;
  field: string;
}
export function JustOneOfBaseOnEnum(
  property: IJustOneOfConstraint[],
  validationOptions?: ValidationOptions,
) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: property,
      validator: JustOneOfBaseOnEnumConstraint,
    });
  };
}
@ValidatorConstraint({ name: 'JustOneOfBaseOnEnum' })
export class JustOneOfBaseOnEnumConstraint
  implements ValidatorConstraintInterface
{
  validate(value: any, args: ValidationArguments) {
    const { constraints, object, property } = args;

    let valueExist: any;

    for (const constraint of constraints) {
      const { enumValue, field } = constraint;
      if (object[field] != null && enumValue === object[property])
        valueExist = object[field];
      if (object[field] != null && enumValue !== object[property]) return false;
    }

    if (!valueExist) return false;
    else return true;
  }

  defaultMessage(args: ValidationArguments) {
    return `MediaType is "${
      args.object[args.property]
    }" but supply ${JSON.stringify(args.constraints)}`;
  }
}

type ValidationEnumStringOptions = {
  enum: Record<string, any>;
  required?: boolean;
  default?: string;
};

export function IsValidEnumNumber(
  opts: ValidationEnumNumberOptions,
): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol): void {
    ApiProperty({
      enum: getValEnumNumber(opts.enum),
    })(target, propertyKey);
    IsEnum(opts.enum)(target, propertyKey);
    if (!opts.required) IsOptional()(target, propertyKey);
    if (opts.default) Default(opts.default)(target, propertyKey);
  };
}

export function IsValidEnumString(
  opts: ValidationEnumStringOptions,
): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol): void {
    ApiProperty({
      enum: getValEnumStr(opts.enum),
    })(target, propertyKey);
    IsEnum(opts.enum)(target, propertyKey);
    if (!opts.required) IsOptional()(target, propertyKey);
  };
}

type ValidationEnumNumberOptions = {
  enum: Record<string, any>;
  required?: boolean;
  default?: number;
};
