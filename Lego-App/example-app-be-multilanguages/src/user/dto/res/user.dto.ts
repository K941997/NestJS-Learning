import { Exclude, Expose, Type } from 'class-transformer';
import { UserTypeResDTO } from './user-type.dto';

@Exclude()
export class UserResDTO {
  @Expose()
  id: string;

  @Expose()
  firId: string;

  @Expose()
  @Type(() => UserTypeResDTO)
  userType: UserTypeResDTO;
}
