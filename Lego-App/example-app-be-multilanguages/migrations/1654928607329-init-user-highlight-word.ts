import {MigrationInterface, QueryRunner} from "typeorm";

export class initUserHighlightWord1654928607329 implements MigrationInterface {
    name = 'initUserHighlightWord1654928607329'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."user_highlight_words_media_type_enum" AS ENUM('video', 'audio')`);
        await queryRunner.query(`CREATE TABLE "user_highlight_words" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "id" SERIAL NOT NULL, "user_id" integer NOT NULL, "ev_dict_idx" integer NOT NULL, "video_id" integer, "audio_id" integer, "media_type" "public"."user_highlight_words_media_type_enum" NOT NULL, CONSTRAINT "UQ_USER_HIGHLIGHT_WORDS" UNIQUE ("user_id", "video_id", "ev_dict_idx", "audio_id"), CONSTRAINT "CHECK_USER_HIGHLIGHT_WORDS" CHECK (
  (
    COALESCE((video_id)::BOOLEAN::INTEGER, 0)
    +
    COALESCE((audio_id)::BOOLEAN::INTEGER, 0)
  ) = 1
), CONSTRAINT "PK_22c879ff3e58a478e2f51da3c66" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user_highlight_words" ADD CONSTRAINT "FK_e8660404a411e16b08c8bcfe8e4" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_highlight_words" ADD CONSTRAINT "FK_f95bfb245a65d6cb7f0ff26135e" FOREIGN KEY ("ev_dict_idx") REFERENCES "evdict"("idx") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_highlight_words" ADD CONSTRAINT "FK_3cd3774549ac91737758883e977" FOREIGN KEY ("video_id") REFERENCES "videos"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_highlight_words" ADD CONSTRAINT "FK_568f9fd2a23f5c83d1398e1c511" FOREIGN KEY ("audio_id") REFERENCES "audios"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_highlight_words" DROP CONSTRAINT "FK_568f9fd2a23f5c83d1398e1c511"`);
        await queryRunner.query(`ALTER TABLE "user_highlight_words" DROP CONSTRAINT "FK_3cd3774549ac91737758883e977"`);
        await queryRunner.query(`ALTER TABLE "user_highlight_words" DROP CONSTRAINT "FK_f95bfb245a65d6cb7f0ff26135e"`);
        await queryRunner.query(`ALTER TABLE "user_highlight_words" DROP CONSTRAINT "FK_e8660404a411e16b08c8bcfe8e4"`);
        await queryRunner.query(`DROP TABLE "user_highlight_words"`);
        await queryRunner.query(`DROP TYPE "public"."user_highlight_words_media_type_enum"`);
    }

}
