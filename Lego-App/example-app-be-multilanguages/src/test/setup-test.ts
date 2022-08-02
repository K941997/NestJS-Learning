import { ExecutionContext, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { DeepPartial, getConnection } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { AppModule } from '../app.module';
import { FirebaseAuthenGuard } from '../auth/guard/firebase-authen.guard';
import { FirebaseAuthorGuard } from '../casl/guard/firebase-author.guard';
import { TranscriptResultDto } from '../common/dtos/transciprt-result.dto';
import { UserToTopics } from '../user/entities/user-to-topics.entity';
import { User } from '../user/entities/user.entity';

// Declare any global var in here to avoid conflict
declare global {
  var app: INestApplication;

  var youtubeUrl: string;
  var wrongYoutubeUrl: string;
  var transcript: TranscriptResultDto;

  var defaultLevelKey: string;
  var defaultTopicKeys: string[];

  var defaultUserId: number;
  var defaultUser: DeepPartial<User>;

  var defaultGroupPoliciesKey: string;
}

global.defaultLevelKey = 'test level';
global.defaultTopicKeys = ['test topic 1', 'test topic 2'];
global.defaultGroupPoliciesKey = 'super_admin';

// defaultUserId must be 1, because primaryGeneratedColumn always set id  from 1
global.defaultUserId = 1;
global.defaultUser = {
  id: defaultUserId,
  firId: uuidv4(),
};

beforeAll(async () => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideGuard(FirebaseAuthorGuard)
    .useValue({
      canActivate: (context: ExecutionContext) => {
        const req = context.switchToHttp().getRequest();
        req.user = defaultUser;
        return true;
      },
    })
    .overrideGuard(FirebaseAuthenGuard)
    .useValue({
      canActivate: (context: ExecutionContext) => {
        const req = context.switchToHttp().getRequest();
        req.user = defaultUser;
        return true;
      },
    })
    .compile();
  global.app = moduleFixture.createNestApplication();
  await app.init();
});

afterEach(async () => {
  // Reset default user
  global.defaultUser = {
    id: defaultUserId,
    firId: uuidv4(),
  };

  // Close connection for each test to clear db data
  const con = getConnection();
  if (con.isConnected) await con.close();
  await con.connect();
});
