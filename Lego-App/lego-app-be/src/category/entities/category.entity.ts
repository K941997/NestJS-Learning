import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  PrimaryColumn,
} from 'typeorm';
import { BaseEntity } from './../../commons/entities/base.entity';
import { ProductToCategoryEntity } from '../../product/entities/product-to-category.entity';
import { BooleanEnum } from '../../commons/enums/global.constant';

@Entity({ name: 'category' })
export class CategoryEntity extends BaseEntity {
  @PrimaryColumn()
  key: string;

  @Column()
  slug: string;

  @Column({
    unique: true,
  })
  name: string;

  @Column({
    nullable: true,
  })
  image: string; //todo: lấy file (Chưa làm)

  @Column({
    nullable: true,
  })
  description: string;

  @Column({ enum: BooleanEnum, default: BooleanEnum.TRUE })
  enabled: BooleanEnum;

  @OneToMany(
    () => ProductToCategoryEntity,
    (productToCategory) => productToCategory.category,
    {
      cascade: ['insert'],
    },
  )
  productToCategory: ProductToCategoryEntity[];
}
