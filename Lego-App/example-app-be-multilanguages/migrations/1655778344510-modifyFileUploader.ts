import { MigrationInterface, QueryRunner } from 'typeorm';

export class modifyFileUploader1655778344510 implements MigrationInterface {
  name = 'modifyFileUploader1655778344510';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "files" DROP CONSTRAINT "FK_9a3333da0464320bdc44ca96cfb"`,
    );
    await queryRunner.query(
      `CREATE TABLE "audio_highlight_words" ("id" SERIAL NOT NULL, "audio_id" integer NOT NULL, "ev_dict_idx" integer NOT NULL, CONSTRAINT "PK_5dc760f44a3bccc31d74607ed2d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "files" ADD CONSTRAINT "FK_9a3333da0464320bdc44ca96cfb" FOREIGN KEY ("uploader_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "audio_highlight_words" ADD CONSTRAINT "FK_478aeecc432e0d62c06b34356d0" FOREIGN KEY ("audio_id") REFERENCES "audios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "audio_highlight_words" ADD CONSTRAINT "FK_7e6d1aac5839f5d5287dff75eac" FOREIGN KEY ("ev_dict_idx") REFERENCES "evdict"("idx") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "audio_highlight_words" DROP CONSTRAINT "FK_7e6d1aac5839f5d5287dff75eac"`,
    );
    await queryRunner.query(
      `ALTER TABLE "audio_highlight_words" DROP CONSTRAINT "FK_478aeecc432e0d62c06b34356d0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "files" DROP CONSTRAINT "FK_9a3333da0464320bdc44ca96cfb"`,
    );
    await queryRunner.query(`DROP TABLE "audio_highlight_words"`);
    await queryRunner.query(
      `ALTER TABLE "files" ADD CONSTRAINT "FK_9a3333da0464320bdc44ca96cfb" FOREIGN KEY ("uploader_id") REFERENCES "admin"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
