/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
  ValidationPipe,
  Session,
  Get,
  Param,
  HttpCode,
  Res,
  Request,
  UsePipes,
  Put,
  ParseIntPipe,
  Delete,
  Patch,
  ClassSerializerInterceptor,
  UseInterceptors,
  BadGatewayException
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/authCredentials.dto';
import { AuthGuard } from '@nestjs/passport';
import { RequestWithUser } from './interface/requestWithUser.interface';
import { request, Response } from 'express';
import { LocalAuthGuard } from './utils/guard/localAuthGuard.guard';
import * as bcrypt from 'bcrypt';
// import { AuthenticatedGuard } from './utils/guard/authGuard.guard';
import { JwtAuthGuard } from './utils/guard/jwtAuthGuard.guard';
import { AppAbility, CaslAbilityFactory } from 'src/casl/casl-ability.factory';
import { PoliciesGuard } from 'src/casl/policiesGuard.guard';
import { CheckPolicies } from 'src/casl/casl-ability.decorator';
import { Action } from 'src/casl/casl-action.enum';
import { UserEntity } from './entity/user.entity';
import { UpdateUserDto } from './dto/updateUser.dto';
import JwtRefreshGuard from './utils/guard/jwtRefreshTokenGuard.guard';
import JwtRefreshTokenGuard from './utils/guard/jwtRefreshTokenGuard.guard';
import { UserDtoFirebase } from './dto/userDtoFirebase.dto';
import { FirebaseAuthGuard } from 'src/firebase/firebase-auth.guard';

import * as firebase from 'firebase/app';
import * as auth from 'firebase/auth';

// const firebase_params = {
//   type: process.env.FIREBASE_TYPE,
//   projectId: process.env.FIREBASE_PROJECT_ID,
//   privateKeyId: process.env.FIREBASE_PRIVATE_KEY_ID,
//   privateKey: process.env.FIREBASE_PRIVATE_KEY,
//   clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
//   clientId: process.env.FIREBASE_CLIENT_ID,
//   authUri: process.env.FIREBASE_AUTH_URI,
//   tokenUri: process.env.FIREBASE_TOKEN_URI,
//   authProviderX509CertUrl: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
//   clientC509CertUrl: process.env.FIREBASE_CLIENT_X509_CERT_URL,
// };

// firebase.initializeApp(firebase_params);
// auth.initializeAuth(firebase.getApp());

@Controller('auth') //localhost:3000/api/auth
@UseInterceptors(ClassSerializerInterceptor) //!Serialize (trả về nhưng ko hiển thị @Exclude Entity)
export class AuthController {
  constructor(
    private readonly authService: AuthService, //!private: vừa khai báo vừa injected vừa khởi tạo
    private caslAbilityFactory: CaslAbilityFactory) {}

  //!SignUp:
  @Post('/signup')
  @UsePipes(ValidationPipe) //có hoặc không vì đã có Global Validation
  signUp(@Body() authCreadentialsDto: AuthCredentialsDto) {
    return this.authService.signUp(authCreadentialsDto);
  }

  // //!SignUp Firebase:
  // @Post('/signupfirebase')
  // signUpFirebase(@Body() body) {
  //   const {email, password} = body;
  //   console.log(email, password);

  //   auth
  //     .createUserWithEmailAndPassword(auth.getAuth(), email, password)
  //     .then(async (user) => {
  //       return user;
  //     })
  //     .catch((err: any) => {
  //       throw new BadGatewayException(err);
  //     })
  // }

 

  //!SignIn:
  //todo: SignIn save (AccessToken, RefreshToken in Cookie) (CurrentRefreshToken in Database)
  @HttpCode(200)
  @UseGuards(LocalAuthGuard) //!LocalStrategy Xác thực người dùng
  @Post('/signin')
  async signIn(@Request() req: RequestWithUser){ //!req lấy thông tin từ LocalAuthGuard
    const user = req.user;
    user.password = undefined;

    //!Access Token:
    const accessTokenCookie = this.authService.getCookieWithJwtAccessToken(user) 

    //!Refresh Token:
    const { 
      cookie: refreshTokenCookie, 
      token: refreshToken 
    } 
    = this.authService.getCookieWithJwtRefreshToken(user.id);

    //!setCurrentRefreshToken Hash:
    await this.authService.setCurrentRefreshToken(refreshToken, user.id)

    //Cookie:
    req.res.setHeader('Set-Cookie', [accessTokenCookie, refreshTokenCookie]);

    //Return:
    return {
      ...user,
      accessTokenCookie, 
      refreshTokenCookie
    }

  }


  //!Refresh:
  @UseGuards(JwtRefreshTokenGuard)
  @Post('refresh')
  refresh(@Req() request) {
    console.log("Đang vào Refresh Controller...")
    
    const user = request.user
    console.log(user, "User in Refresh Controller")

    const accessTokenCookie = this.authService.getCookieWithJwtAccessToken(user);
 
    request.res.setHeader('Set-Cookie', accessTokenCookie);
    return user;
  }

  //!LogOut:
  //todo: LogOut = Access Token -> CurrentRefreshToken = Null
  @UseGuards(JwtAuthGuard)
  @Post('signout')
  @HttpCode(200)
  async logOut(@Req() request: RequestWithUser) {
    await this.authService.removeRefreshToken(request.user.id);
    request.res.setHeader('Set-Cookie', this.authService.getCookiesForLogOut());
  }


  // //!Protected (Session Cookie Không cần nhập tài khoản):
  // @UseGuards(AuthenticatedGuard) //!Remove SessionCookie to use Guard JWTToken return access_token = BearerToken check SessionCookie:
  // @Get('/protected')
  // getHello(@Request() req): string{
  //   return req.user; //!return with jwtStrategy
  // }

  //!Get Self Info After Guard SignIn:
  @Get('/profile')
  @UseGuards(JwtAuthGuard)
  getSelfInfo(@Req() request) { //!request lấy thông tin từ JWTToken
    const user = request.user;
    user.password = undefined;
    return user; //không có logic ở service nên return user luôn
  }

  //!Get All Users:
  @Get()
  findAllUsers() {
    return this.authService.findAllUsers();
  }

  

  //!Get User By Id: (Cần dùng):
  //!(Đã xong) Vì trùng /:username: (Thay = /username/:username)
  @Get('/:id')
  getUserInfoById(@Param('id', ParseIntPipe) id: number) {
    return this.authService.findUserById(id);
  }

  //!Get User By Username: (Không cần dùng):
  //!(Đã xong) Vì trùng /:id: (Thay = /username/:username)
  @Get('/username/:username')
  getUserInfoByUsername(@Param('username') username: string) {
    return this.authService.findUserByUsername(username);
  }

  //!Update User Advanced CASL Role:
  @Patch('/:id') //dùng Patch thay cho Put
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  async updateTask(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: RequestWithUser, //!(Req after LogIn) use in CASL
  ): Promise<UserEntity> {
    //todo: CASL to Role + isCreator:
    //todo: CASL to Service:
    const user = req.user
    //!(Đã xong) Lỗi update xong bị sai tài khoản vì chưa bcrypt:
    return this.authService.updateUser(id, updateUserDto, user);
  }

  //!Delete User Advanced CASL Role isAdmin isCreator:
  //!(Đã xong) nếu xóa 1 User phải xóa cả các relation:
  @Delete('/:id')
  //todo: CASL cho vào Service:
  @UseGuards(JwtAuthGuard) //!JwtAuthGuard
  async deleteUser(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: RequestWithUser, //!(Req after LogIn) use in CASL
  ): Promise<void> {
    const user = req.user

    return this.authService.deleteUser(id, user);
  }
  

  // //!Log Out: (Không cần làm vì là của Frontend)
  // @UseGuards(JwtAuthGuard)
  // @Post('signout')
  // async logOut(@Req() request: RequestWithUser, @Res() response: Response) {
  //   response.setHeader('Set-Cookie', this.authService.getCookieForLogOut());
  //   return response.sendStatus(200);
  // }
}
