/* eslint-disable prettier/prettier */
import { ArrayMaxSize, ArrayMinSize, ArrayUnique, IsDefined, IsNumber, IsOptional } from "class-validator";
/* eslint-disable prettier/prettier */
export function IsValidArrayNumber( //!Custom Decorator (For CreateUpdateTask with Relation)
    { required, minSize, maxSize, unique }: ValidationArrayOptions = { 
      unique: true,
    },
  ): PropertyDecorator {
    return function (target: any, propertyKey: string | symbol): void {
      IsNumber({}, { each: true })(target, propertyKey);
      ArrayMinSize(minSize || 0)(target, propertyKey);
      ArrayMaxSize(maxSize || 100)(target, propertyKey);
      if (unique) ArrayUnique()(target, propertyKey);
      if (required) IsDefined()(target, propertyKey);
      else IsOptional()(target, propertyKey);
    };
  }