import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'evdict' })
export class EvDict {
  @PrimaryGeneratedColumn('increment')
  idx: number;

  @Column({ length: 50, unique: true })
  word: string;

  @Column()
  detail: string;
}
