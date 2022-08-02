import {MigrationInterface, QueryRunner} from "typeorm";

export class initTopic1655204473664 implements MigrationInterface {
    name = 'initTopic1655204473664'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "topic_translation" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "version" integer NOT NULL DEFAULT '1', "id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "lang" character varying(255) NOT NULL DEFAULT 'en', "topic_key" character varying NOT NULL, CONSTRAINT "UQ_9f399eb35e7a05e70bd30fad243" UNIQUE ("name"), CONSTRAINT "UQ_TOPIC_TRANSLATE_1" UNIQUE ("topic_key", "lang"), CONSTRAINT "CHK_TOPIC_TRANSLATE_1" CHECK ("lang" IN ('en', 'vi')), CONSTRAINT "PK_b1336a0cc87989fc611995b3c55" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "topic" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "version" integer NOT NULL DEFAULT '1', "key" character varying NOT NULL, "slug" character varying, "description" character varying, "enabled" integer NOT NULL DEFAULT '1', CONSTRAINT "PK_4ac1a37c122e88622beccfc65b8" PRIMARY KEY ("key"))`);
        await queryRunner.query(`ALTER TABLE "topic_translation" ADD CONSTRAINT "FK_b93b774fdf48651aa0f536670e5" FOREIGN KEY ("topic_key") REFERENCES "topic"("key") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "topic_translation" DROP CONSTRAINT "FK_b93b774fdf48651aa0f536670e5"`);
        await queryRunner.query(`DROP TABLE "topic"`);
        await queryRunner.query(`DROP TABLE "topic_translation"`);
    }

}
