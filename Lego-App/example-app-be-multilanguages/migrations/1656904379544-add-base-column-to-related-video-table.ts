import {MigrationInterface, QueryRunner} from "typeorm";

export class addBaseColumnToRelatedVideoTable1656904379544 implements MigrationInterface {
    name = 'addBaseColumnToRelatedVideoTable1656904379544'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "video_highlight_words" ADD "created_at" TIMESTAMP WITH TIME ZONE DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "video_highlight_words" ADD "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "video_highlight_words" ADD "deleted_at" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "video_highlight_words" ADD "version" integer DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE "video_transcripts" ADD "created_at" TIMESTAMP WITH TIME ZONE DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "video_transcripts" ADD "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "video_transcripts" ADD "deleted_at" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "video_transcripts" ADD "version" integer DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE "video_types" ADD "created_at" TIMESTAMP WITH TIME ZONE DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "video_types" ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "video_types" ADD "deleted_at" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "video_types" ADD "version" integer NOT NULL DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE "videos_to_topic" ADD "created_at" TIMESTAMP WITH TIME ZONE DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "videos_to_topic" ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "videos_to_topic" ADD "deleted_at" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "videos_to_topic" ADD "version" integer NOT NULL DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE "audio_thumbnail" ALTER COLUMN "created_at" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "files" ALTER COLUMN "created_at" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "level_translation" ALTER COLUMN "created_at" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "topic_translation" ALTER COLUMN "created_at" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "topic" ALTER COLUMN "created_at" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "videos" ALTER COLUMN "created_at" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "level" ALTER COLUMN "created_at" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "admin" ALTER COLUMN "created_at" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "client" ALTER COLUMN "created_at" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "audios" ALTER COLUMN "created_at" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "audio_transcripts" ALTER COLUMN "created_at" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "audio_transcripts" ALTER COLUMN "created_at" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "audios" ALTER COLUMN "created_at" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "client" ALTER COLUMN "created_at" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "admin" ALTER COLUMN "created_at" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "level" ALTER COLUMN "created_at" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "videos" ALTER COLUMN "created_at" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "topic" ALTER COLUMN "created_at" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "topic_translation" ALTER COLUMN "created_at" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "level_translation" ALTER COLUMN "created_at" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "files" ALTER COLUMN "created_at" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "audio_thumbnail" ALTER COLUMN "created_at" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "videos_to_topic" DROP COLUMN "version"`);
        await queryRunner.query(`ALTER TABLE "videos_to_topic" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "videos_to_topic" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "videos_to_topic" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "video_types" DROP COLUMN "version"`);
        await queryRunner.query(`ALTER TABLE "video_types" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "video_types" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "video_types" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "video_transcripts" DROP COLUMN "version"`);
        await queryRunner.query(`ALTER TABLE "video_transcripts" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "video_transcripts" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "video_transcripts" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "video_highlight_words" DROP COLUMN "version"`);
        await queryRunner.query(`ALTER TABLE "video_highlight_words" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "video_highlight_words" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "video_highlight_words" DROP COLUMN "created_at"`);
    }

}
