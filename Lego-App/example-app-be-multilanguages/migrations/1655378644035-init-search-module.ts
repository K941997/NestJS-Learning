import {MigrationInterface, QueryRunner} from "typeorm";

export class initSearchModule1655378644035 implements MigrationInterface {
    name = 'initSearchModule1655378644035'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_searchs" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "id" SERIAL NOT NULL, "keyword" character varying(100) NOT NULL, "searchTime" TIMESTAMP WITH TIME ZONE NOT NULL, "user_id" integer NOT NULL, CONSTRAINT "UQ_7a567a480d55b27e73d1fc37830" UNIQUE ("keyword"), CONSTRAINT "PK_efd97c0aa78d66d74c757c56477" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "videos" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "videos" ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "videos" ADD "deleted_at" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "videos" ADD "version" integer NOT NULL DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE "user_highlight_words" ADD "deleted_at" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "user_searchs" ADD CONSTRAINT "FK_243902c35e1e125c7e791f446a8" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_searchs" DROP CONSTRAINT "FK_243902c35e1e125c7e791f446a8"`);
        await queryRunner.query(`ALTER TABLE "user_highlight_words" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "videos" DROP COLUMN "version"`);
        await queryRunner.query(`ALTER TABLE "videos" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "videos" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "videos" DROP COLUMN "created_at"`);
        await queryRunner.query(`DROP TABLE "user_searchs"`);
    }
}
