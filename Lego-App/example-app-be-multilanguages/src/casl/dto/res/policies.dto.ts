import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import {
  Action,
  ActionAbility,
  Resource,
} from '../../../common/enums/global.enum';

export class PoliciesDto {
  @ApiProperty({ example: 1 })
  @IsString()
  id: number;

  @ApiProperty({ enum: Action, example: Action.MANAGE })
  @IsEnum(Action)
  action: Action;

  @ApiProperty({ enum: Resource, example: Resource.USER })
  @IsEnum(Resource)
  resource: Resource;

  @ApiProperty({ example: 'Quản lý người dùng' })
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({ enum: ActionAbility, example: 'can' })
  @IsEnum(ActionAbility)
  actionAbility: ActionAbility;
}
