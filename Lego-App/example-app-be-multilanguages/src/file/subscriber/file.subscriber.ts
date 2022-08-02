import { ConfigService } from '@nestjs/config';
import { InjectConnection } from '@nestjs/typeorm';
import {
  Connection,
  EntitySubscriberInterface,
  EventSubscriber,
  LoadEvent,
} from 'typeorm';
import { IGlobalConfig } from '../../common/config/global.config';
import { File } from '../entities/file.entity';

@EventSubscriber()
export class FileSubscriber implements EntitySubscriberInterface<File> {
  constructor(
    @InjectConnection() readonly connection: Connection,
    private configService: ConfigService<IGlobalConfig>,
  ) {
    connection.subscribers.push(this);
  }

  listenTo() {
    return File;
  }

  /**
   * Called before insert.
   */
  async afterLoad(entity: File, event: LoadEvent<File>) {
    event.entity.url = this.createUrl(entity.key);
  }

  private createUrl(key: string) {
    const bucket = this.configService.get('s3.awsS3BucketName', {
      infer: true,
    });
    const region = this.configService.get('s3.awsS3Region', { infer: true });
    const baseUrl = `https://s3.${region}.amazonaws.com/${bucket}`;
    return `${baseUrl}/${key}`;
  }
}
