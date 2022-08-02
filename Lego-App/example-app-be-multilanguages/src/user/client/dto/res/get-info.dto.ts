import { Exclude, Expose, Type } from 'class-transformer';
import { FileRes } from '../../../../file/dto/res/file.dto';
import { ClientDTO } from './client.dto';

@Exclude()
export class GetInfoDTO {
  @Expose()
  id: string;

  @Expose()
  fir: string;

  @Expose()
  levelKey: string;

  @Expose()
  @Type(() => ClientDTO)
  client: ClientDTO;

  @Expose()
  @Type(() => FileRes)
  avatar: FileRes;
}
