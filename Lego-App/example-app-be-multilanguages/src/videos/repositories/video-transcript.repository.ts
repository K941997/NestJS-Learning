import { EntityRepository, Repository } from "typeorm";
import { VideoTranscripts } from "../entities/video-transcripts.entity";
import { Videos } from "../entities/videos.entity";


@EntityRepository(VideoTranscripts)
export class VideoTranscriptsRepository extends Repository<VideoTranscripts> {}