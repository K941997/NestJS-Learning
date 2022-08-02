import { MigrationInterface, QueryRunner } from 'typeorm';

export class integrateTopicLevelAudio1655721537400
  implements MigrationInterface
{
  name = 'integrateTopicLevelAudio1655721537400';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "audios_to_topics" ("id" SERIAL NOT NULL, "topic_key" character varying NOT NULL, "audio_id" integer NOT NULL, CONSTRAINT "PK_f92eec83eeb34f0181f2cbaf506" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "audios" ADD "level_key" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "audios_to_topics" ADD CONSTRAINT "FK_6f16e475feb9ea66ba17d33d698" FOREIGN KEY ("topic_key") REFERENCES "topic"("key") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "audios_to_topics" ADD CONSTRAINT "FK_abad9259f100d41a08dfb3e9071" FOREIGN KEY ("audio_id") REFERENCES "audios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "audios" ADD CONSTRAINT "FK_67e618ddb0c775fb1dc0a4104d0" FOREIGN KEY ("level_key") REFERENCES "level"("key") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "audios" DROP CONSTRAINT "FK_67e618ddb0c775fb1dc0a4104d0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "audios_to_topics" DROP CONSTRAINT "FK_abad9259f100d41a08dfb3e9071"`,
    );
    await queryRunner.query(
      `ALTER TABLE "audios_to_topics" DROP CONSTRAINT "FK_6f16e475feb9ea66ba17d33d698"`,
    );
    await queryRunner.query(`ALTER TABLE "audios" DROP COLUMN "level_key"`);
    await queryRunner.query(`DROP TABLE "audios_to_topics"`);
  }
}
