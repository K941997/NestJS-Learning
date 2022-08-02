import {
  NameConstraintEntity,
  LangEnum,
} from '../../common/constants/global.constant';
import { ColumnString } from '../../common/decorators/custom-column.decorator';
import { BaseEntity } from '../../common/entities/base.entity'; //version, createAt, updateAt, deleteAt
import { getEnumStr } from '../../common/utils';
import {
  Entity,
  Unique,
  Check,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Level } from './level.entity';

@Entity()
@Unique(`${NameConstraintEntity.UQ_LEVEL_TRANSLATE_1}`, ['levelKey', 'lang'])
@Check(
  `${NameConstraintEntity.CHK_LEVEL_TRANSLATE_1}`,
  `"lang" IN (${getEnumStr(LangEnum)})`,
)
export class LevelTranslation extends BaseEntity {
  @PrimaryGeneratedColumn({})
  id: number;

  @ColumnString({ unique: true })
  name: string;

  @ColumnString({ default: LangEnum.En, enum: LangEnum })
  lang: LangEnum;

  @Column({ name: 'level_key' })
  levelKey: string;

  @ManyToOne(() => Level, (level) => level.translates, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([
    { name: 'level_key', referencedColumnName: 'key' },
    // { name: 'level_id', referencedColumnName: 'id' },
  ])
  level: Level;
}
