import { MigrationInterface, QueryRunner } from 'typeorm';

export class initVideoTypes1654744593952 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO video_types (key, "desc") values ('youtube', 'desc')`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM video_types WHERE video_types.key = 'youtube'`,
    );
  }
}
