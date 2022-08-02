import { Exclude, Expose, Type } from 'class-transformer';
import { UserResDTO } from '../../../dto/res/user.dto';

@Exclude()
export class CreateAdminResDTO {
  @Expose()
  id: number;

  @Expose()
  email: string;

  @Expose()
  @Type(() => UserResDTO)
  user: UserResDTO;
}
