import { EntityRepository, Repository } from 'typeorm';
import { VideoTypes } from '../entities/video-types.entity';

@EntityRepository(VideoTypes)
export class VideoTypesRepository extends Repository<VideoTypes> {}
