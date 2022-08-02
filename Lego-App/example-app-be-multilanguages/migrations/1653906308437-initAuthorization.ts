import { MigrationInterface, QueryRunner } from 'typeorm';

export class initAuthorization1653906308437 implements MigrationInterface {
  name = 'initAuthorization1653906308437';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."policies_action_enum" AS ENUM('manage', 'read', 'write')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."policies_resource_enum" AS ENUM('all', 'user', 'admin', 'video', 'audio')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."policies_action_ability_enum" AS ENUM('can', 'cannot')`,
    );
    await queryRunner.query(
      `CREATE TABLE "policies" ("id" SERIAL NOT NULL, "action" "public"."policies_action_enum" NOT NULL, "resource" "public"."policies_resource_enum" NOT NULL, "action_ability" "public"."policies_action_ability_enum" NOT NULL, "name" character varying NOT NULL, CONSTRAINT "UQ_3d6f8d44a991b53e2899a65ebaf" UNIQUE ("name"), CONSTRAINT "UQ_POLICIES" UNIQUE ("action", "resource", "action_ability"), CONSTRAINT "PK_603e09f183df0108d8695c57e28" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "group_to_policies" ("policies_id" integer NOT NULL, "group_policies_key" character varying NOT NULL, CONSTRAINT "PK_5171e689edfae630e185aeb3571" PRIMARY KEY ("policies_id", "group_policies_key"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_to_group_policies" ("user_id" integer NOT NULL, "group_policies_key" character varying NOT NULL, CONSTRAINT "PK_e6eef956357944afc5bd5e63eaa" PRIMARY KEY ("user_id", "group_policies_key"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "group_policies" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "key" character varying NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, CONSTRAINT "UQ_7c566c55e3d0a3dd867acaac6a3" UNIQUE ("name"), CONSTRAINT "PK_0bc8188a2d04103baad6cf80109" PRIMARY KEY ("key"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "group_to_policies" ADD CONSTRAINT "FK_928fe46bb5d393ed73366bdfb47" FOREIGN KEY ("policies_id") REFERENCES "policies"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "group_to_policies" ADD CONSTRAINT "FK_055224aaf063fd5de749988b53e" FOREIGN KEY ("group_policies_key") REFERENCES "group_policies"("key") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_to_group_policies" ADD CONSTRAINT "FK_43701fc0bf5550c0a65fbc5c1e6" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_to_group_policies" ADD CONSTRAINT "FK_d7a6d1fa49a698e4ec23fc6c099" FOREIGN KEY ("group_policies_key") REFERENCES "group_policies"("key") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_to_group_policies" DROP CONSTRAINT "FK_d7a6d1fa49a698e4ec23fc6c099"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_to_group_policies" DROP CONSTRAINT "FK_43701fc0bf5550c0a65fbc5c1e6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "group_to_policies" DROP CONSTRAINT "FK_055224aaf063fd5de749988b53e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "group_to_policies" DROP CONSTRAINT "FK_928fe46bb5d393ed73366bdfb47"`,
    );
    await queryRunner.query(`DROP TABLE "group_policies"`);
    await queryRunner.query(`DROP TABLE "user_to_group_policies"`);
    await queryRunner.query(`DROP TABLE "group_to_policies"`);
    await queryRunner.query(`DROP TABLE "policies"`);
    await queryRunner.query(
      `DROP TYPE "public"."policies_action_ability_enum"`,
    );
    await queryRunner.query(`DROP TYPE "public"."policies_resource_enum"`);
    await queryRunner.query(`DROP TYPE "public"."policies_action_enum"`);
  }
}
