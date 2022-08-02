import {MigrationInterface, QueryRunner} from "typeorm";

export class removeNullableOfFeatureColAtTableVideo1657013176044 implements MigrationInterface {
    name = 'removeNullableOfFeatureColAtTableVideo1657013176044'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "videos" ALTER COLUMN "is_feature" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "videos" ALTER COLUMN "is_feature" SET DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "videos" ALTER COLUMN "is_feature" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "videos" ALTER COLUMN "is_feature" DROP NOT NULL`);
    }

}
