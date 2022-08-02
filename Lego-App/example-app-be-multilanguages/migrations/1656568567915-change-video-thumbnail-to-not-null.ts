import {MigrationInterface, QueryRunner} from "typeorm";

export class changeVideoThumbnailToNotNull1656568567915 implements MigrationInterface {
    name = 'changeVideoThumbnailToNotNull1656568567915'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "videos" DROP CONSTRAINT "UQ_f5ee2202e099f3acfde0b77f03e"`);
        await queryRunner.query(`ALTER TABLE "videos" ALTER COLUMN "thumbnails" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "videos" ADD CONSTRAINT "UQ_VIDE_CODE" UNIQUE ("video_code", "deleted_at")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "videos" DROP CONSTRAINT "UQ_VIDE_CODE"`);
        await queryRunner.query(`ALTER TABLE "videos" ALTER COLUMN "thumbnails" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "videos" ADD CONSTRAINT "UQ_f5ee2202e099f3acfde0b77f03e" UNIQUE ("video_code")`);
    }

}
