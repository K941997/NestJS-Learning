import { MigrationInterface, QueryRunner } from 'typeorm';

export class audioTranscript1654572200472 implements MigrationInterface {
  name = 'audioTranscript1654572200472';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "audio_transcripts" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "version" integer NOT NULL DEFAULT '1', "id" SERIAL NOT NULL, "content" jsonb NOT NULL, "start_time" character varying NOT NULL, "audio_id" integer NOT NULL, CONSTRAINT "PK_9700935c9a96a1ad5bed114f345" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "audio_transcripts" ADD CONSTRAINT "FK_c22def46fb80b41dec702e9895c" FOREIGN KEY ("audio_id") REFERENCES "audios"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "audio_transcripts" DROP CONSTRAINT "FK_c22def46fb80b41dec702e9895c"`,
    );
    await queryRunner.query(`DROP TABLE "audio_transcripts"`);
  }
}
