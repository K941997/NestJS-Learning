import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { BaseEntity } from '../../commons/entities/base.entity';
import { ProductEntity } from './product.entity';
import { CategoryEntity } from '../../category/entities/category.entity';

@Entity({ name: 'product-to-category' })
export class ProductToCategoryEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'product_key' })
  productKey: string;

  @Column({ name: 'category_key' })
  categoryKey: string;

  @ManyToOne(() => ProductEntity, (product) => product.productToCategory, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_key' })
  product: ProductEntity;

  @ManyToOne(() => CategoryEntity, (category) => category.productToCategory, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'category_key' })
  category: CategoryEntity;
}
