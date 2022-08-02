import {MigrationInterface, QueryRunner} from "typeorm";

export class audiosToTopicsAddDeleteAtOnDeleteCascade1657097362839 implements MigrationInterface {
    name = 'audiosToTopicsAddDeleteAtOnDeleteCascade1657097362839'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "audios_to_topics" DROP CONSTRAINT "FK_abad9259f100d41a08dfb3e9071"`);
        await queryRunner.query(`ALTER TABLE "audios_to_topics" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "audios_to_topics" ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "audios_to_topics" ADD "deleted_at" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "audios_to_topics" ADD "version" integer NOT NULL DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE "audios_to_topics" ADD CONSTRAINT "FK_abad9259f100d41a08dfb3e9071" FOREIGN KEY ("audio_id") REFERENCES "audios"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "audios_to_topics" DROP CONSTRAINT "FK_abad9259f100d41a08dfb3e9071"`);
        await queryRunner.query(`ALTER TABLE "audios_to_topics" DROP COLUMN "version"`);
        await queryRunner.query(`ALTER TABLE "audios_to_topics" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "audios_to_topics" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "audios_to_topics" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "audios_to_topics" ADD CONSTRAINT "FK_abad9259f100d41a08dfb3e9071" FOREIGN KEY ("audio_id") REFERENCES "audios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
