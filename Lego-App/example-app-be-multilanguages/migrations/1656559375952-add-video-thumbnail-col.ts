import {MigrationInterface, QueryRunner} from "typeorm";

export class addVideoThumbnailCol1656559375952 implements MigrationInterface {
    name = 'addVideoThumbnailCol1656559375952'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "videos" ADD "thumbnails" jsonb`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "videos" DROP COLUMN "thumbnails"`);
    }

}
