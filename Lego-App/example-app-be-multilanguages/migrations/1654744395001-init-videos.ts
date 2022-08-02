import {MigrationInterface, QueryRunner} from "typeorm";

export class initVideos1654744395001 implements MigrationInterface {
    name = 'initVideos1654744395001'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "evdict" ("idx" SERIAL NOT NULL, "word" character varying(50) NOT NULL, "detail" character varying NOT NULL, CONSTRAINT "UQ_4f22cb89440032e6e0224a4897c" UNIQUE ("word"), CONSTRAINT "PK_406a5e66be1d39064482dd5f952" PRIMARY KEY ("idx"))`);
        await queryRunner.query(`CREATE TABLE "video_types" ("key" character varying(30) NOT NULL, "desc" character varying(255) NOT NULL, CONSTRAINT "PK_24e41e873a9677db6c32265e5fc" PRIMARY KEY ("key"))`);
        await queryRunner.query(`CREATE TABLE "videos" ("id" SERIAL NOT NULL, "video_code" character varying(20) NOT NULL, "name" character varying(50) NOT NULL, "desc" character varying(250) NOT NULL, "length" integer NOT NULL, "video_types_key" character varying(30) NOT NULL, CONSTRAINT "UQ_f5ee2202e099f3acfde0b77f03e" UNIQUE ("video_code"), CONSTRAINT "PK_e4c86c0cf95aff16e9fb8220f6b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "video_transcripts" ("id" SERIAL NOT NULL, "content" character varying NOT NULL, "start_time" integer NOT NULL, "duration" integer NOT NULL, "videos_id" integer NOT NULL, CONSTRAINT "PK_b29781f452c24d675491f0b8ffb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "video_highlight_words" ("id" SERIAL NOT NULL, "video_transcripts_id" integer NOT NULL, "ev_dict_idx" integer NOT NULL, CONSTRAINT "PK_14154e9a1953e0756472381c89d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "version"`);
        await queryRunner.query(`ALTER TABLE "videos" ADD CONSTRAINT "FK_0df679de33ae05d1cd60534de9a" FOREIGN KEY ("video_types_key") REFERENCES "video_types"("key") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "video_transcripts" ADD CONSTRAINT "FK_1cadec6f3c5120f1bac89fbe336" FOREIGN KEY ("videos_id") REFERENCES "videos"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "video_highlight_words" ADD CONSTRAINT "FK_838c1f0c27ea55cd7e03f58e00e" FOREIGN KEY ("video_transcripts_id") REFERENCES "video_transcripts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "video_highlight_words" ADD CONSTRAINT "FK_1eb0329373d739e3694e9cdd80b" FOREIGN KEY ("ev_dict_idx") REFERENCES "evdict"("idx") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "video_highlight_words" DROP CONSTRAINT "FK_1eb0329373d739e3694e9cdd80b"`);
        await queryRunner.query(`ALTER TABLE "video_highlight_words" DROP CONSTRAINT "FK_838c1f0c27ea55cd7e03f58e00e"`);
        await queryRunner.query(`ALTER TABLE "video_transcripts" DROP CONSTRAINT "FK_1cadec6f3c5120f1bac89fbe336"`);
        await queryRunner.query(`ALTER TABLE "videos" DROP CONSTRAINT "FK_0df679de33ae05d1cd60534de9a"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "version" integer NOT NULL DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE "users" ADD "deleted_at" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "users" ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "users" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`DROP TABLE "video_highlight_words"`);
        await queryRunner.query(`DROP TABLE "video_transcripts"`);
        await queryRunner.query(`DROP TABLE "videos"`);
        await queryRunner.query(`DROP TABLE "video_types"`);
        await queryRunner.query(`DROP TABLE "evdict"`);
    }

}
