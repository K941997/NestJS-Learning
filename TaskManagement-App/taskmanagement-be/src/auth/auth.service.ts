/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/authCredentials.dto';
// import { JwtPayload } from './utils/payload/jwtPayload.interface';
import { UserEntity } from './entity/user.entity';
import { UserRepository } from './user.repository';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { from, map, Observable } from 'rxjs';
import { UpdateUserDto } from './dto/updateUser.dto';
import { CaslAbilityFactory } from 'src/casl/casl-ability.factory';
import { ForbiddenError } from '@casl/ability';
import { Action } from 'src/casl/casl-action.enum';

import * as dotenv from 'dotenv';
import { TokenPayload } from './interface/tokenPayload.interface';
dotenv.config()


@Injectable() //!@Injectable: injected Service to Controller
export class AuthService {
  constructor(
    @InjectRepository(UserRepository) //!@InjectRepository: đưa UserRepository vào Service
    private userRepository: UserRepository, //!private: vừa khai báo vừa injected vừa khởi tạo
    // private usersRepository: Repository<User>, //! dùng cách này

    private jwtService: JwtService,
    private readonly configService: ConfigService,
    private caslAbilityFactory: CaslAbilityFactory
  ) {}

  //!Sign Up:
  async create(userData: AuthCredentialsDto) {
    const newUser = await this.userRepository.create(userData); //todo: Repo.create dto
    await this.userRepository.save(newUser); //todo: Repo.save
    return newUser;
  }

  async signUp(authCredentialsDto: AuthCredentialsDto) { //!Vì chỉ lấy DTO username password nên UserEntity phải nullable:true
    const hashedPassword = await bcrypt.hash(authCredentialsDto.password, 10); //10 = bcrypt.genSalt(10)
    try{
      const createdUser = await this.create({
        ...authCredentialsDto,
        password: hashedPassword
      });
      return createdUser;
       
    } catch(err) {
      if (err?.code === '23505') {
        throw new HttpException('User with that Username already exists', HttpStatus.BAD_REQUEST);
      }
      throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  //!Verify Password: (for LocalStrategy) Xác thực người dùng: 
  //Todo: for ValidateUser: (for LocalStrategy)
  private async verifyPassword(plainTextPassword: string, hashedPassword: string) {
    const isPasswordMatching = await bcrypt.compare(
      plainTextPassword,
      hashedPassword
    );
    if (!isPasswordMatching) {
      throw new HttpException('Sai mật khẩu', HttpStatus.BAD_REQUEST);
    }
  }

  //!ValidateUser: (for LocalStrategy) Xác thực người dùng: 
  //Todo: for LocalStrategy for LocalGuard (for Login): 
  public async validateUser(username: string, plainTextPassword: string) {
    try {
      const user = await this.userRepository.findOne({username});

      await this.verifyPassword(plainTextPassword, user.password);
      return user;
    } catch (error) {
      console.log(username, plainTextPassword, 'Lỗi Validate User');

      throw new HttpException('Sai tài khoản', HttpStatus.BAD_REQUEST);
    }
  }


  //!Access Token: (For Login + CRUD)
  public getCookieWithJwtAccessToken(user: any) {
    console.log("Đang vào AccessToken Service...")

    console.log(user, "User AccessToken Service")

    const payload = {sub: user.id} //todo: send payload to jwtStrategy
    console.log(payload, "payload User AccessToken Service")
    
    const token = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET_KEY,
      expiresIn: process.env.JWT_TIME_EXPIRES_IN
    });
    return `Authentication = ${token}; HttpOnly; Path = /; Max-Age = ${process.env.JWT_TIME_EXPIRES_IN}`
  }


  //!Refresh Token: (For Login)
  public getCookieWithJwtRefreshToken(userId: number) {
    const payload  = { userId } //todo: send payload to jwtRefreshTokenStrategy
    console.log(payload, "payload User RefreshToken Service")
    const token = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_TOKEN_SECRET,
      expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN
    });
    const cookie = `Refresh = ${token}; HttpOnly; Path = /; Max-Age = ${process.env.JWT_REFRESH_TOKEN_EXPIRES_IN}`;
    return {
      cookie,
      token
    }
  }
  

  //!setCurrentRefreshToken Hash: (For UserEntity For Login)
  async setCurrentRefreshToken(refreshToken: string, userId: number) {
    const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.userRepository.update(userId, {
      currentHashedRefreshToken
    });
  }


  //!GetUserIfRFMatches: (For jwtRFStrategy For Refresh)
  async getUserIfRefreshTokenMatches(refreshToken: string, userId: number) {
    console.log("Đang vào getUserIfRefreshTokenMatches Service...")

    const user = await this.findUserById(userId);
    if (!user) {
      console.log("Ko tìm thấy user")
    }
 
    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      user.currentHashedRefreshToken
    );
    if (isRefreshTokenMatching) {
      return user;
    } else {
      console.log("RefreshToken Not Matches")
    }

    console.log("Đã xong getUserIfRefreshTokenMatches Service...")

   
  }
  
  //!LogOut:
  public getCookiesForLogOut() {
    return [
      'Authentication=; HttpOnly; Path=/; Max-Age=0',
      'Refresh=; HttpOnly; Path=/; Max-Age=0'
    ];
  }


  //!RemoveRefreshTokenWhenLogOut: (For LogOut)
  async removeRefreshToken(user:any) {
    return this.userRepository.update(user, {
      currentHashedRefreshToken: null
    });
  }
  
  
  
  //!Get All Users:
  async findAllUsers(): Promise<UserEntity[]> {
    const query = this.userRepository.createQueryBuilder('user')
      .orderBy("user.id");

    const allUsers =  await query.getMany();
    for (const oneUser of allUsers) {
      oneUser.password = undefined;   
    }

    return allUsers;
  }

  //!Get User By Id: (Cần dùng):
  //!(Đã xong) Vì trùng /:username:
  async findUserById(id: number): Promise<UserEntity> {
    const userFound = await this.userRepository.findOne(id, {relations: ['tasks']});

    if (!userFound) { //Error Handle:
      throw new NotFoundException(`User with ID ${id} not found !`);
    } else {
      return userFound;
    }
  }

  //!Get One User: (Không cần dùng)
  //!(Đã xong) Vì trùng /:id:
  async findUserByUsername(username: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where: { username: username }  })
    console.log(user);
    
    if (user) {
      return user;
    } else {
      throw new HttpException('User with this username does not exist', HttpStatus.NOT_FOUND);
    }
  }

  //!Update User: (CASL Role isAdmin isCreator):
  async updateUser (id: number, updateUserDto: UpdateUserDto, user: UserEntity): Promise<UserEntity> {
    const caslAbility = this.caslAbilityFactory.createForUser(user)
    if (!caslAbility) {
      throw new UnauthorizedException()
    }

    const userToUpdate = await this.findUserById(id);

    ForbiddenError.from(caslAbility)
      .setMessage('only admin or creator!')
      .throwUnlessCan(Action.Update, userToUpdate);
  
    const { name, password } = updateUserDto;

    userToUpdate.name = name;
    // userToUpdate.address = address;
    //!(Đã xong) Lỗi update xong bị sai tài khoản vì chưa bcrypt:
    //!(Chưa Xong) Đây chỉ là cập nhật không ảnh hưởng relation:
    //todo: Cập nhật có ảnh hưởng relation thì xem Task Service
    userToUpdate.password = await bcrypt.hash(password, 10);

    await userToUpdate.save();
    return userToUpdate;
  }

  //!Delete User use CASL Role:
  //!(Đã xong) nếu xóa 1 User phải xóa cả các relation:
  async deleteUser(id: number, user: UserEntity): Promise<void> {
    const caslAbility = this.caslAbilityFactory.createForUser(user)

    //todo: CASL isAdmin isCreator:
    const userToDelete = await this.userRepository.findOne(id, {relations: ['tasks']});
    ForbiddenError.from(caslAbility)
      .setMessage('only admin or creator!')
      .throwUnlessCan(Action.Delete, userToDelete);

    const result = await this.userRepository.delete(id);
    if (result.affected === 0) { //Error Handle:
      throw new NotFoundException(`User with ID ${id} is not found !`);
    }

  }

  
  // //!LogOut: (Không cần vì Frontend làm Logout)
  // public getCookieForLogOut() {
  //   return `Authentication=; HttpOnly; Path=/; Max-Age=0`;
  // }


  
}
