import {MigrationInterface, QueryRunner} from "typeorm";

export class addIsFeatureColTovideosTable1656996668070 implements MigrationInterface {
    name = 'addIsFeatureColTovideosTable1656996668070'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "videos" ADD "is_feature" boolean`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "videos" DROP COLUMN "is_feature"`);
    }

}
