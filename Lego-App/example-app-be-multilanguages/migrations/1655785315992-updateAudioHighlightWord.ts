import { MigrationInterface, QueryRunner } from 'typeorm';

export class updateAudioHighlightWord1655785315992
  implements MigrationInterface
{
  name = 'updateAudioHighlightWord1655785315992';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "audio_highlight_words" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "audio_highlight_words" ADD "deleted_at" TIMESTAMP WITH TIME ZONE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "audio_highlight_words" DROP COLUMN "deleted_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "audio_highlight_words" DROP COLUMN "created_at"`,
    );
  }
}
