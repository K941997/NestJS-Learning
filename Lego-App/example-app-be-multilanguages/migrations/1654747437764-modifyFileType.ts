import { MigrationInterface, QueryRunner } from 'typeorm';

export class modifyFileType1654747437764 implements MigrationInterface {
  name = 'modifyFileType1654747437764';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "files" ALTER COLUMN "type" SET DEFAULT 'mp3'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "files" ALTER COLUMN "type" SET DEFAULT 'images'`,
    );
  }
}
