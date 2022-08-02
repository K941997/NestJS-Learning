import {MigrationInterface, QueryRunner} from "typeorm";

export class seedLevelTopic1655525826400 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`INSERT INTO LEVEL ("key", "slug", "description", "enabled")
        VALUES ('test level', 'test-level', 'description', 1)`)
      await queryRunner.query(`INSERT INTO level_translation ("name", "lang", "level_key")
        VALUES ('test level', 'en', 'test level')`)
      await queryRunner.query(`INSERT INTO topic ("key", "slug", "description", "enabled")
        VALUES ('test topic 1', 'test-topic-1', 'description', 1),
             ('test topic 2', 'test-topic-2', 'description', 1)`)
      await queryRunner.query(`INSERT INTO topic_translation ("name", "lang", "topic_key")
        VALUES ('test topic 1', 'en', 'test topic 1'),
             ('test topic 2', 'en', 'test topic 2')`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`DELETE FROM LEVEL WHERE "key" = 'test level'`)
      await queryRunner.query(`DELETE FROM level_translation WHERE "level_key" = 'test level'`)
      await queryRunner.query(`DELETE FROM topic WHERE "key" = 'test topic 1' OR "key" = 'test topic 2'`)
      await queryRunner.query(`DELETE FROM topic_translation WHERE "topic_key" = 'test topic 1'
        OR "topic_key" = 'test topic 2'`)
    }

}
