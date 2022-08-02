import { Injectable } from '@nestjs/common';
import * as firebase from 'firebase-admin';
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';
import { AudioRepository } from '../../../audio/repository/audio.repository';
import { UserTypeKey } from '../../../common/enums/global.enum';
import {
  BadRequestExc,
  ConflictExc,
  ExpectationFailedExc,
  InternalServerErrorExc,
} from '../../../common/exceptions/custom.exception';
import { FileService } from '../../../file/file.service';
import { VideosRepository } from '../../../videos/repositories/videos.repository';
import { AdminRepository } from '../../admin/repository/admin.repository';
import { User } from '../../entities/user.entity';
import { UserToTopicsRepository } from '../../repository/user-to-topics.repository';
import { UserTypeRepository } from '../../repository/user-type.repository';
import { UserRepository } from '../../repository/user.repository';
import { transformUserToTopicsToTopicKeys } from '../../utils/helper.util';
import { ChooseLevelTopicDto } from '../dto/req/choose-level-topic.dto';
import { LoginDTO } from '../dto/req/login.dto';
import { RegisterDTO } from '../dto/req/register.dto';
import { UpdateInfoDTO } from '../dto/req/update-info.dto';
import { ClientRepository } from '../repository/client.repository';

@Injectable()
export class ClientService {
  constructor(
    private clientRepository: ClientRepository,
    private adminRepository: AdminRepository,
    private userRepository: UserRepository,
    private userTypeRepository: UserTypeRepository,
    private videosRepo: VideosRepository,
    private audioRepo: AudioRepository,
    private userToTopicRepo: UserToTopicsRepository,
    private fileService: FileService,
  ) {}

  async register(body: RegisterDTO) {
    const { email, phone, fullname, firIdToken } = body;
    const firebaseUser: DecodedIdToken | any = await firebase
      .auth()
      .verifyIdToken(firIdToken);

    // error when invalid firebase token
    if (!firebaseUser) {
      throw new BadRequestExc('Invalid firebase idToken');
    }

    // error when user already exists
    const existingUser = await this.userRepository.findOne({
      firId: firebaseUser.uid,
    });

    if (existingUser) {
      throw new ConflictExc('User already exists');
    }

    // error when email exists
    const clientEmail = await this.clientRepository.findOne({ email });
    const adminEmail = await this.adminRepository.findOne({ email });
    if (clientEmail || adminEmail) {
      throw new ConflictExc('Email already exists');
    }

    // error when phone exists
    const clientPhone = await this.clientRepository.findOne({ phone });
    if (clientPhone) {
      throw new ConflictExc('Phone already exists');
    }

    // get user type
    const userType = await this.userTypeRepository.findOne({
      key: UserTypeKey.CLIENT,
    });

    if (!userType) {
      throw new InternalServerErrorExc();
    }

    // create new user
    const newUser = await this.userRepository.save({
      firId: firebaseUser?.uid,
      userType,
    });

    return this.clientRepository.save({
      email,
      phone,
      fullname,
      user: newUser,
    });
  }

  async updateInfo(user: User, body: UpdateInfoDTO) {
    const { avatarId, email, phone, fullname } = body;
    const avatar = await this.fileService.findOneOrError(avatarId);
    user.avatar = avatar;
    const client = await this.clientRepository.findOneOrFail({ user });
    await this.userRepository.save(user);
    await this.clientRepository.save({
      id: client.id,
      email,
      phone,
      fullname,
    });
  }

  async getInfo(user: User) {
    const qb = this.userRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id: user.id })
      .leftJoinAndSelect('user.client', 'client')
      .leftJoinAndSelect('user.avatar', 'avatar')
      .getOne();
    return qb;
  }

  async login(body: LoginDTO) {
    const { firIdToken } = body;
    const firebaseUser: DecodedIdToken | any = await firebase
      .auth()
      .verifyIdToken(firIdToken);

    // error when invalid firebase token
    if (!firebaseUser) {
      throw new BadRequestExc('Invalid firebase idToken');
    }
    const existingUser = await this.userRepository.findOne({
      firId: firebaseUser?.uid,
    });
    if (!existingUser) {
      throw new BadRequestExc('User not found');
    }
    return { firIdToken };
  }

  async getRelevantContents(user: User) {
    const userToTopics = await this.userToTopicRepo.find({ user });
    const topicKeys = transformUserToTopicsToTopicKeys(userToTopics);
    const levelKey = user.levelKey;

    const videoBuilder = this.videosRepo
      .createQueryBuilder('videos')
      .leftJoin('videos.videosToTopics', 'videosToTopics')
      .leftJoin('videosToTopics.topic', 'topic')
      .where({ levelKey })
      .groupBy('videos.id')
      .select('videos.id')
      .orderBy('videos.id', 'DESC')
      .take(10);

    const audioBuilder = this.audioRepo
      .createQueryBuilder('audio')
      .leftJoin('audio.audiosToTopics', 'audiosToTopics')
      .leftJoin('audiosToTopics.topic', 'topic')
      .where({ levelKey })
      .groupBy('audio.id')
      .select('audio.id')
      .orderBy('audio.id', 'DESC')
      .take(10);

    if (topicKeys?.length) {
      videoBuilder.andWhere('topic.key IN (:...topicKeys)', {
        topicKeys,
      });
      audioBuilder.andWhere('topic.key IN (:...topicKeys)', {
        topicKeys,
      });
    }

    const [relevantVideoIds, relevantAudioIds] = await Promise.all([
      videoBuilder.getMany(),
      audioBuilder.getMany(),
    ]);

    const [videos, audios] = await Promise.all([
      Promise.all(
        relevantVideoIds.map(async (item) =>
          this.videosRepo
            .createQueryBuilder('videos')
            .leftJoinAndSelect('videos.level', 'level')
            .leftJoinAndSelect('videos.videosToTopics', 'videosToTopics')
            .leftJoinAndSelect('videosToTopics.topic', 'topic')
            .where('videos.id = :id', { id: item.id })
            .getOne(),
        ),
      ),
      Promise.all(
        relevantAudioIds.map(async (item) =>
          this.audioRepo
            .createQueryBuilder('audio')
            .leftJoinAndSelect('audio.level', 'level')
            .leftJoinAndSelect('audio.audiosToTopics', 'audiosToTopics')
            .leftJoinAndSelect('audiosToTopics.topic', 'topic')
            .where('videos.id = :id', { id: item.id })
            .getOne(),
        ),
      ),
    ]);

    return { videos, audios };
  }

  async chooseTopicsAndLevel(dataDto: ChooseLevelTopicDto, user: User) {
    const { levelKey, topicKeys } = dataDto;

    if (user.levelKey)
      throw new ExpectationFailedExc('User has already chosen level');
    const existUserToTopics = await this.userToTopicRepo.find({
      userId: user.id,
    });
    if (existUserToTopics.length > 0)
      throw new ExpectationFailedExc('User has already chosen topics');

    const userToTopics = topicKeys.map((topicKey) =>
      this.userToTopicRepo.create({ topicKey, userId: user.id }),
    );

    user.levelKey = levelKey;
    await Promise.all([
      this.userRepository.save(user),
      this.userToTopicRepo.save(userToTopics),
    ]);
    return user;
  }
}
