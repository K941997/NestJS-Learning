import { MigrationInterface, QueryRunner } from 'typeorm';

export class initAudio1654163750672 implements MigrationInterface {
  name = 'initAudio1654163750672';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "audio_types" ("key" character varying NOT NULL, "desc" character varying NOT NULL, CONSTRAINT "PK_351d57bc2d817396ae471094689" PRIMARY KEY ("key"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "audios" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "version" integer NOT NULL DEFAULT '1', "id" SERIAL NOT NULL, "audio_code" character varying NOT NULL, "audio_type_key" character varying NOT NULL, "title" character varying NOT NULL, "desc" character varying NOT NULL, CONSTRAINT "UQ_4bc72bcd52bae827513425b8bf5" UNIQUE ("audio_code"), CONSTRAINT "PK_97a1fa83e0d0dac358d498d0a64" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "audio_thumbnail" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "version" integer NOT NULL DEFAULT '1', "id" SERIAL NOT NULL, "audio_id" integer NOT NULL, "file_id" integer NOT NULL, "thumbnail_id" integer NOT NULL, CONSTRAINT "REL_d8ead3d94cd9713eb21be23450" UNIQUE ("audio_id"), CONSTRAINT "REL_dc44578c80616ba2f60140054d" UNIQUE ("file_id"), CONSTRAINT "REL_eac10420a23aafa4e14ee7d32b" UNIQUE ("thumbnail_id"), CONSTRAINT "PK_4ac9633eb48fc7727ac5ecf0065" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "audios" ADD CONSTRAINT "FK_80aa9d706cf0850654b38bb76f2" FOREIGN KEY ("audio_type_key") REFERENCES "audio_types"("key") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "audio_thumbnail" ADD CONSTRAINT "FK_d8ead3d94cd9713eb21be23450d" FOREIGN KEY ("audio_id") REFERENCES "audios"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "audio_thumbnail" ADD CONSTRAINT "FK_dc44578c80616ba2f60140054d5" FOREIGN KEY ("file_id") REFERENCES "files"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "audio_thumbnail" ADD CONSTRAINT "FK_eac10420a23aafa4e14ee7d32b9" FOREIGN KEY ("thumbnail_id") REFERENCES "files"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `INSERT INTO "audio_types" ("key", "desc") VALUES ('internet', 'This is an internet audio'), ('uploaded', 'This is an uploaded audio');`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "audio_thumbnail" DROP CONSTRAINT "FK_eac10420a23aafa4e14ee7d32b9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "audio_thumbnail" DROP CONSTRAINT "FK_dc44578c80616ba2f60140054d5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "audio_thumbnail" DROP CONSTRAINT "FK_d8ead3d94cd9713eb21be23450d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "audios" DROP CONSTRAINT "FK_80aa9d706cf0850654b38bb76f2"`,
    );
    await queryRunner.query(`DROP TABLE "audio_thumbnail"`);
    await queryRunner.query(`DROP TABLE "audios"`);
    await queryRunner.query(`DROP TABLE "audio_types"`);
  }
}
