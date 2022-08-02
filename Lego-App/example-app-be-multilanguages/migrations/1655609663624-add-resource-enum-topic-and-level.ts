import {MigrationInterface, QueryRunner} from "typeorm";

export class addResourceEnumTopicAndLevel1655609663624 implements MigrationInterface {
    name = 'addResourceEnumTopicAndLevel1655609663624'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "policies" DROP CONSTRAINT "UQ_POLICIES"`);
        await queryRunner.query(`ALTER TYPE "public"."policies_resource_enum" RENAME TO "policies_resource_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."policies_resource_enum" AS ENUM('all', 'user', 'admin', 'video', 'audio', 'topic', 'level')`);
        await queryRunner.query(`ALTER TABLE "policies" ALTER COLUMN "resource" TYPE "public"."policies_resource_enum" USING "resource"::"text"::"public"."policies_resource_enum"`);
        await queryRunner.query(`DROP TYPE "public"."policies_resource_enum_old"`);
        await queryRunner.query(`ALTER TABLE "videos" DROP CONSTRAINT "FK_01f5c7e962b111ac11cee20de85"`);
        await queryRunner.query(`ALTER TABLE "videos" DROP CONSTRAINT "UQ_01f5c7e962b111ac11cee20de85"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_9aa11c127a5acc71473d745aa77"`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "level_key" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "policies" ADD CONSTRAINT "UQ_POLICIES" UNIQUE ("action", "resource", "action_ability")`);
        await queryRunner.query(`ALTER TABLE "videos" ADD CONSTRAINT "FK_01f5c7e962b111ac11cee20de85" FOREIGN KEY ("level_key") REFERENCES "level"("key") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_9aa11c127a5acc71473d745aa77" FOREIGN KEY ("level_key") REFERENCES "level"("key") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_9aa11c127a5acc71473d745aa77"`);
        await queryRunner.query(`ALTER TABLE "videos" DROP CONSTRAINT "FK_01f5c7e962b111ac11cee20de85"`);
        await queryRunner.query(`ALTER TABLE "policies" DROP CONSTRAINT "UQ_POLICIES"`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "level_key" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_9aa11c127a5acc71473d745aa77" FOREIGN KEY ("level_key") REFERENCES "level"("key") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "videos" ADD CONSTRAINT "UQ_01f5c7e962b111ac11cee20de85" UNIQUE ("level_key")`);
        await queryRunner.query(`ALTER TABLE "videos" ADD CONSTRAINT "FK_01f5c7e962b111ac11cee20de85" FOREIGN KEY ("level_key") REFERENCES "level"("key") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`CREATE TYPE "public"."policies_resource_enum_old" AS ENUM('all', 'user', 'admin', 'video', 'audio')`);
        await queryRunner.query(`ALTER TABLE "policies" ALTER COLUMN "resource" TYPE "public"."policies_resource_enum_old" USING "resource"::"text"::"public"."policies_resource_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."policies_resource_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."policies_resource_enum_old" RENAME TO "policies_resource_enum"`);
        await queryRunner.query(`ALTER TABLE "policies" ADD CONSTRAINT "UQ_POLICIES" UNIQUE ("action", "resource", "action_ability")`);
    }

}
