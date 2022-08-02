import { Exclude, Expose, Type } from 'class-transformer';
import { UserResDTO } from '../../../dto/res/user.dto';

@Exclude()
export class RegisterResDTO {
  @Expose()
  email: string;

  @Expose()
  phone: string;

  @Expose()
  fullname: string;

  @Expose()
  firIdToken: string;

  @Expose()
  @Type(() => UserResDTO)
  user: UserResDTO;
}
