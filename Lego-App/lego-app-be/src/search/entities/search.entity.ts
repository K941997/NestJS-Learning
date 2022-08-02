import { BaseEntity } from '../../commons/entities/base.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { MaxLength } from 'class-validator';

@Entity({ name: `search` })
export class Search extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255, unique: true })
  keyword: string;

  @Column()
  searchTime: Date;
}
