import {MigrationInterface, QueryRunner} from "typeorm";

export class initLevel1655201468734 implements MigrationInterface {
    name = 'initLevel1655201468734'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "level_translation" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "version" integer NOT NULL DEFAULT '1', "id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "lang" character varying(255) NOT NULL DEFAULT 'en', "level_key" character varying NOT NULL, CONSTRAINT "UQ_f55ce6fc64e06758f520ec16973" UNIQUE ("name"), CONSTRAINT "UQ_LEVEL_TRANSLATE_1" UNIQUE ("level_key", "lang"), CONSTRAINT "CHK_LEVEL_TRANSLATE_1" CHECK ("lang" IN ('en', 'vi')), CONSTRAINT "PK_2679bb7dce638ccee56930e5139" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "level" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "version" integer NOT NULL DEFAULT '1', "key" character varying NOT NULL, "slug" character varying, "description" character varying, "enabled" integer NOT NULL DEFAULT '1', CONSTRAINT "PK_7d7c3111081b0974ba50c66a6be" PRIMARY KEY ("key"))`);
        await queryRunner.query(`ALTER TABLE "level_translation" ADD CONSTRAINT "FK_fd35000c14c062646479c492f03" FOREIGN KEY ("level_key") REFERENCES "level"("key") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "level_translation" DROP CONSTRAINT "FK_fd35000c14c062646479c492f03"`);
        await queryRunner.query(`DROP TABLE "level"`);
        await queryRunner.query(`DROP TABLE "level_translation"`);
    }

}
