import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import * as firebase from 'firebase-admin';
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';
import { v4 as uuidv4 } from 'uuid';
import { UserTypeKey } from '../../../common/enums/global.enum';
import {
  BadRequestExc,
  ConflictExc,
  ForbiddenExc,
  InternalServerErrorExc,
} from '../../../common/exceptions/custom.exception';
import { ClientRepository } from '../../client/repository/client.repository';
import { UserTypeRepository } from '../../repository/user-type.repository';
import { UserRepository } from '../../repository/user.repository';
import { CreateAdminDto } from '../dto/req/create-admin.dto';
import { AdminLoginDto } from '../dto/req/login.dto';
import { AdminRepository } from '../repository/admin.repository';
// import { initializeApp } from 'firebase/app';
import { UserToGroupPoliciesRepository } from '../../../casl/repository/user-to-group-policies.repository';

@Injectable()
export class AdminService {
  constructor(
    private adminRepository: AdminRepository,
    private userRepository: UserRepository,
    private userTypeRepository: UserTypeRepository,
    private clientRepository: ClientRepository,
    private userToGroupPoliciesRepo: UserToGroupPoliciesRepository,
  ) {}

  async create(body: CreateAdminDto) {
    const { email } = body;

    // error when email exists
    const clientEmail = await this.clientRepository.findOne({ email });
    const adminEmail = await this.adminRepository.findOne({ email });
    if (clientEmail || adminEmail) {
      throw new ConflictExc('Email already exists');
    }

    const firId = uuidv4();
    const hashPassword = await bcrypt.hash('Clv12345', 10);
    const results = await firebase.auth().importUsers(
      [
        {
          uid: firId,
          email: body.email,
          passwordHash: Buffer.from(hashPassword),
        },
      ],
      { hash: { algorithm: 'BCRYPT' } },
    );

    if (results.failureCount > 0) {
      throw new InternalServerErrorExc();
    }

    const firUser = await firebase.auth().getUserByEmail(email);

    // get user type
    const userType = await this.userTypeRepository.findOne({
      key: UserTypeKey.ADMIN,
    });

    if (!userType) {
      throw new InternalServerErrorExc();
    }

    const userToGroupPolicy = this.userToGroupPoliciesRepo.create({
      // This is seeded group policy
      groupPoliciesKey: 'super_admin',
    });

    // create new user
    const newUser = await this.userRepository.save({
      firId: firUser.uid,
      userType,
      userToGroupPolicies: [userToGroupPolicy],
    });

    return this.adminRepository.save({ email, user: newUser });
  }

  async login(body: AdminLoginDto) {
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

  // // For testing purposes only
  // async loginTest(body: LoginTestDto) {
  //   const { email, password } = body;
  //   const firebaseConfig = {
  //     apiKey: 'AIzaSyBOxS3YxOjAQoy2HQZLsSHAAC4-ukhgO0c',
  //     authDomain: 'bili-dev.firebaseapp.com',
  //     projectId: 'bili-dev',
  //     storageBucket: 'bili-dev.appspot.com',
  //     messagingSenderId: '213696605314',
  //     appId: '1:213696605314:web:0c52d075195101b484989b',
  //     measurementId: 'G-2QYDPXDQ08',
  //   };
  //   const app = initializeApp(firebaseConfig);
  //   const auth = getAuth(app);

  //   try {
  //     const userCredential = await signInWithEmailAndPassword(
  //       auth,
  //       email,
  //       password,
  //     );
  //     const idToken = await userCredential.user.getIdToken();
  //     return idToken;
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }
}
