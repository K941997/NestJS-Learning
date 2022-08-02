import { MigrationInterface, QueryRunner } from 'typeorm';

export class seedPolicies1655609745043 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(` INSERT INTO policies (id, action, resource, action_ability, "name")
      VALUES 
        (1, 'manage', 'all', 'can', 'Super Admin'),
        (2, 'manage', 'user', 'can', 'Manage user'),
        (3, 'manage', 'admin', 'can', 'Manage admin'),
        (4, 'manage', 'video', 'can', 'Manage video'),
        (5, 'manage', 'audio', 'can', 'Manage audio'),
        (6, 'manage', 'topic', 'can', 'Manage topic'),
        (7, 'manage', 'level', 'can', 'Manage level');
      `);
    await queryRunner.query(`
      INSERT INTO "group_policies" ("key", "name", "description")
      VALUES ('super_admin', 'Super Admin', 'This is super admin')
    `);
    await queryRunner.query(`
      INSERT INTO "group_to_policies" ("policies_id", "group_policies_key") 
      VALUES (1, 'super_admin')
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM policies WHERE id = 1
        OR id = 2
        OR id = 3
        OR id = 4
        OR id = 5
        OR id = 6
        OR id = 7;
      `);
    await queryRunner.query(`
      DELETE FROM "group_policies" WHERE "key" = 'super_admin'
    `);
    await queryRunner.query(`
      DELETE FROM "group_to_policies" WHERE "policies_id" = 1 AND "group_policies_key" = 'super_admin'
    `);
  }
}
