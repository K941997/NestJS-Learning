import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AudioRepository } from '../audio/repository/audio.repository';
import { UserToGroupPoliciesRepository } from '../casl/repository/user-to-group-policies.repository';
import { FileRepository } from '../file/file.repository';
import { FileService } from '../file/file.service';
import { LevelRepository } from '../level/repositories/topic.repository';
import { TopicRepository } from '../topic/repositories/topic.repository';
import { TopicModule } from '../topic/topic.module';
import { UtilsModule } from '../utils-module/utils.module';
import { VideosRepository } from '../videos/repositories/videos.repository';
import { AdminController } from './admin/controller/admin.controller';
import { Admin } from './admin/entities/admin.entity';
import { AdminRepository } from './admin/repository/admin.repository';
import { AdminService } from './admin/service/admin.service';
import { ClientController } from './client/controller/client.controller';
import { Client } from './client/entities/client.entity';
import { ClientRepository } from './client/repository/client.repository';
import { ClientService } from './client/service/client.service';
import { UserController } from './controller/user.controller';
import { UserType } from './entities/user-type.entity';
import { User } from './entities/user.entity';
import { UserToTopicsRepository } from './repository/user-to-topics.repository';
import { UserTypeRepository } from './repository/user-type.repository';
import { UserRepository } from './repository/user.repository';
import { UserService } from './service/user.service';

@Module({
  imports: [
    TopicModule,
    TypeOrmModule.forFeature([
      User,
      UserType,
      Admin,
      Client,
      UserRepository,
      ClientRepository,
      AdminRepository,
      UserTypeRepository,
      VideosRepository,
      AudioRepository,
      UserToTopicsRepository,
      TopicRepository,
      LevelRepository,
      UserToGroupPoliciesRepository,
      FileRepository,
    ]),
    UtilsModule,
  ],
  controllers: [UserController, ClientController, AdminController],
  providers: [UserService, ClientService, AdminService, FileService],
  exports: [UserService],
})
export class UserModule {}
