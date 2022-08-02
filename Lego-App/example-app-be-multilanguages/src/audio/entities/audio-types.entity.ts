import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { Audio } from './audio.entity';

@Entity('audio_types')
export class AudioTypes {
  @PrimaryColumn()
  key: string;

  @OneToMany(() => Audio, (audio) => audio.audioType)
  audios: Audio[];

  @Column()
  desc: string;
}
