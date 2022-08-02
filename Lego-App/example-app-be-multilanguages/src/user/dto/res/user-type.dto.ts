import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UserTypeResDTO {
  @Expose()
  key: string;

  @Expose()
  description: string;
}
