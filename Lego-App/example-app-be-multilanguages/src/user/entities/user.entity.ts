import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserToGroupPolicies } from '../../casl/entities/user-to-group-policies.entity';
import { File } from '../../file/entities/file.entity';
import { UserHighlightWords } from '../../user-highlight/entities/user-highlight-word.entity';
import { Level } from '../../level/entities/level.entity';
import { UserSearchs } from '../../search/entities/user-searchs.entity';
import { Admin } from '../admin/entities/admin.entity';
import { Client } from '../client/entities/client.entity';
import { UserToTopics } from './user-to-topics.entity';
import { UserType } from './user-type.entity';

@Entity('users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserType, (userType) => userType.key, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'user_type' })
  userType: UserType;

  @Column({ unique: true })
  firId: string;

  @OneToOne(() => Client, (client) => client.user)
  client: Client;

  @OneToOne(() => Admin, (admin) => admin.user)
  admin: Admin;

  @OneToOne(() => File, (file) => file.id, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'avatar_id' })
  avatar: File;

  @OneToMany(
    () => UserToGroupPolicies,
    (userToGroupPolicies) => userToGroupPolicies.user,
    { cascade: ['insert'] },
  )
  userToGroupPolicies: UserToGroupPolicies[];

  // Join user_highlight_words
  @OneToMany(
    () => UserHighlightWords,
    (userHighlightWord) => userHighlightWord.user,
    { cascade: ['insert'] },
  )
  userHighlightWords: UserHighlightWords[];
  // End join user_highlight_words

  // Join user_searchs
  @OneToMany(() => UserSearchs, (userSearchs) => userSearchs.user, {
    cascade: ['insert'],
  })
  userSearchs: UserSearchs[];
  // End join user_searchs

  // Join user_level
  @Column({ name: 'level_key', nullable: true })
  levelKey: string;

  @ManyToOne(() => Level, (level) => level.user, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'level_key' })
  level: Level;
  // End join user_level

  // Join user_to_topic
  @OneToMany(() => UserToTopics, (userTotopics) => userTotopics.user, {
    cascade: ['insert'],
  })
  userToTopics: UserToTopics[];
  // End join user_to_topic

  @OneToMany(() => File, (file) => file.uploader)
  files: File[];
}
