import {MigrationInterface, QueryRunner} from "typeorm";

export class removeUpdatedAtColumnOfHighlightWord1655102257305 implements MigrationInterface {
    name = 'removeUpdatedAtColumnOfHighlightWord1655102257305'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_highlight_words" DROP COLUMN "updated_at"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_highlight_words" ADD "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now()`);
    }

}
