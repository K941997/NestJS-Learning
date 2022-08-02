import { BooleanEnum } from '../../commons/enums/global.constant';
import { Column, Entity, PrimaryColumn, OneToMany } from 'typeorm';
import { BaseEntity } from './../../commons/entities/base.entity';
import { ProductEntity } from './../../product/entities/product.entity';

@Entity({ name: 'theme' })
export class ThemeEntity extends BaseEntity {
  @PrimaryColumn()
  key: string;

  @Column()
  slug: string;

  @Column({
    //custom multilanguages 1-n
    unique: true,
  })
  name: string;

  @Column({
    nullable: true,
  })
  image: string; //todo: nhập File (Chưa làm)

  @Column({
    nullable: true,
  })
  description: string;

  @Column({ enum: BooleanEnum, default: BooleanEnum.TRUE })
  enabled: BooleanEnum;

  @OneToMany(() => ProductEntity, (product) => product.theme, {
    cascade: ['insert'], //cascade nên cho vào @OneToMany
  })
  products: ProductEntity[];
}
