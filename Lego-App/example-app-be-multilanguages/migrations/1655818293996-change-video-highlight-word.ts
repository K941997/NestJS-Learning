import {MigrationInterface, QueryRunner} from "typeorm";

export class changeVideoHighlightWord1655818293996 implements MigrationInterface {
    name = 'changeVideoHighlightWord1655818293996'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "video_highlight_words" DROP CONSTRAINT "FK_838c1f0c27ea55cd7e03f58e00e"`);
        await queryRunner.query(`ALTER TABLE "video_highlight_words" RENAME COLUMN "video_transcripts_id" TO "videos_id"`);
        await queryRunner.query(`ALTER TABLE "video_highlight_words" ADD CONSTRAINT "FK_452776a8894ff87f4585c4382cb" FOREIGN KEY ("videos_id") REFERENCES "videos"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "video_highlight_words" DROP CONSTRAINT "FK_452776a8894ff87f4585c4382cb"`);
        await queryRunner.query(`ALTER TABLE "video_highlight_words" RENAME COLUMN "videos_id" TO "video_transcripts_id"`);
        await queryRunner.query(`ALTER TABLE "video_highlight_words" ADD CONSTRAINT "FK_838c1f0c27ea55cd7e03f58e00e" FOREIGN KEY ("video_transcripts_id") REFERENCES "video_transcripts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
