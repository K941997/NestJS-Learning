import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class ClientDTO {
  @Expose()
  id: number;

  @Expose()
  email: string;

  @Expose()
  phone: string;

  @Expose()
  fullname: string;
}
