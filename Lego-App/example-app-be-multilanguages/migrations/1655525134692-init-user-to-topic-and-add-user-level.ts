import {MigrationInterface, QueryRunner} from "typeorm";

export class initUserToTopicAndAddUserLevel1655525134692 implements MigrationInterface {
    name = 'initUserToTopicAndAddUserLevel1655525134692'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_to_topics" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "id" SERIAL NOT NULL, "user_id" integer NOT NULL, "topic_key" character varying NOT NULL, CONSTRAINT "PK_9e3faf7cebeea5cce5ddc379f67" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "videos_to_topic" ("id" SERIAL NOT NULL, "topic_key" character varying NOT NULL, "videos_id" integer NOT NULL, CONSTRAINT "PK_230bad101ced9273238bffc3910" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "videos" ADD "level_key" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "videos" ADD CONSTRAINT "UQ_01f5c7e962b111ac11cee20de85" UNIQUE ("level_key")`);
        await queryRunner.query(`ALTER TABLE "users" ADD "level_key" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "files" ALTER COLUMN "verified" SET DEFAULT '-1'`);
        await queryRunner.query(`ALTER TABLE "user_to_topics" ADD CONSTRAINT "FK_99c967b3122cfebc8209792ab4d" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_to_topics" ADD CONSTRAINT "FK_05ec3270709ac236e0a7b13ba1f" FOREIGN KEY ("topic_key") REFERENCES "topic"("key") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "videos_to_topic" ADD CONSTRAINT "FK_bc89dee8ec74f5f286e7be41a60" FOREIGN KEY ("topic_key") REFERENCES "topic"("key") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "videos_to_topic" ADD CONSTRAINT "FK_73a00528b9e7f7ddbec3808e8d3" FOREIGN KEY ("videos_id") REFERENCES "videos"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "videos" ADD CONSTRAINT "FK_01f5c7e962b111ac11cee20de85" FOREIGN KEY ("level_key") REFERENCES "level"("key") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_9aa11c127a5acc71473d745aa77" FOREIGN KEY ("level_key") REFERENCES "level"("key") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_9aa11c127a5acc71473d745aa77"`);
        await queryRunner.query(`ALTER TABLE "videos" DROP CONSTRAINT "FK_01f5c7e962b111ac11cee20de85"`);
        await queryRunner.query(`ALTER TABLE "videos_to_topic" DROP CONSTRAINT "FK_73a00528b9e7f7ddbec3808e8d3"`);
        await queryRunner.query(`ALTER TABLE "videos_to_topic" DROP CONSTRAINT "FK_bc89dee8ec74f5f286e7be41a60"`);
        await queryRunner.query(`ALTER TABLE "user_to_topics" DROP CONSTRAINT "FK_05ec3270709ac236e0a7b13ba1f"`);
        await queryRunner.query(`ALTER TABLE "user_to_topics" DROP CONSTRAINT "FK_99c967b3122cfebc8209792ab4d"`);
        await queryRunner.query(`ALTER TABLE "files" ALTER COLUMN "verified" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "level_key"`);
        await queryRunner.query(`ALTER TABLE "videos" DROP CONSTRAINT "UQ_01f5c7e962b111ac11cee20de85"`);
        await queryRunner.query(`ALTER TABLE "videos" DROP COLUMN "level_key"`);
        await queryRunner.query(`DROP TABLE "videos_to_topic"`);
        await queryRunner.query(`DROP TABLE "user_to_topics"`);
    }

}
