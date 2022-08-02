import { MigrationInterface, QueryRunner } from 'typeorm';

export class initFile1654050704477 implements MigrationInterface {
  name = 'initFile1654050704477';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "files" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "version" integer NOT NULL DEFAULT '1', "id" SERIAL NOT NULL, "key" character varying NOT NULL, "bucket" character varying NOT NULL, "type" character varying NOT NULL DEFAULT 'images', "size" integer NOT NULL DEFAULT '0', "verified" integer NOT NULL DEFAULT '0', "uploader_id" integer NOT NULL, CONSTRAINT "UQ_a5c218dfdf6ad6092fed2230a88" UNIQUE ("key"), CONSTRAINT "PK_6c16b9093a142e0e7613b04a3d9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_a5c218dfdf6ad6092fed2230a8" ON "files" ("key") `,
    );
    await queryRunner.query(
      `ALTER TABLE "files" ADD CONSTRAINT "FK_9a3333da0464320bdc44ca96cfb" FOREIGN KEY ("uploader_id") REFERENCES "admin"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "files" DROP CONSTRAINT "FK_9a3333da0464320bdc44ca96cfb"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_a5c218dfdf6ad6092fed2230a8"`,
    );
    await queryRunner.query(`DROP TABLE "files"`);
  }
}
