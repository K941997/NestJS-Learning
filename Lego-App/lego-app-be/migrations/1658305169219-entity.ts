import { MigrationInterface, QueryRunner } from 'typeorm';

export class entity1658305169219 implements MigrationInterface {
  name = 'entity1658305169219';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "theme" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "version" integer NOT NULL DEFAULT '1', "key" character varying NOT NULL, "slug" character varying NOT NULL, "name" character varying NOT NULL, "image" character varying, "description" character varying, "enabled" integer NOT NULL DEFAULT '1', CONSTRAINT "UQ_5be2c2e7186ad7cbd83f94fb4de" UNIQUE ("name"), CONSTRAINT "PK_7b0e03a94450de6bb2114896b24" PRIMARY KEY ("key"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "product" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "version" integer NOT NULL DEFAULT '1', "key" character varying NOT NULL, "slug" character varying NOT NULL, "name" character varying NOT NULL, "image" character varying, "price" integer, "description" character varying, "enabled" integer NOT NULL DEFAULT '1', "status" character varying NOT NULL DEFAULT 'available', "theme_key" character varying, CONSTRAINT "UQ_22cc43e9a74d7498546e9a63e77" UNIQUE ("name"), CONSTRAINT "PK_120ea9ee74ef0e0774629d448e4" PRIMARY KEY ("key"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "product-to-category" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "version" integer NOT NULL DEFAULT '1', "id" SERIAL NOT NULL, "product_key" character varying NOT NULL, "category_key" character varying NOT NULL, CONSTRAINT "PK_ea99ce2dc8594e7781a3ef0308e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "category" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "version" integer NOT NULL DEFAULT '1', "key" character varying NOT NULL, "slug" character varying NOT NULL, "name" character varying NOT NULL, "image" character varying, "description" character varying, "enabled" integer NOT NULL DEFAULT '1', CONSTRAINT "UQ_23c05c292c439d77b0de816b500" UNIQUE ("name"), CONSTRAINT "PK_7c82c39b0dc8ef1ba334eb615a3" PRIMARY KEY ("key"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "search" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "version" integer NOT NULL DEFAULT '1', "id" SERIAL NOT NULL, "keyword" character varying(255) NOT NULL, "searchTime" TIMESTAMP NOT NULL, CONSTRAINT "UQ_45084d8e5d834f6192d1e5e9c8f" UNIQUE ("keyword"), CONSTRAINT "PK_0bdd0dc9f37fc71a6050de7ae7f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "product" ADD CONSTRAINT "FK_1e5bc2ac4f3d1a8abd0fe9f9c84" FOREIGN KEY ("theme_key") REFERENCES "theme"("key") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product-to-category" ADD CONSTRAINT "FK_74e842980a178046c4c031a24f0" FOREIGN KEY ("product_key") REFERENCES "product"("key") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product-to-category" ADD CONSTRAINT "FK_1dd4e92f441c63a483ffab7d438" FOREIGN KEY ("category_key") REFERENCES "category"("key") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product-to-category" DROP CONSTRAINT "FK_1dd4e92f441c63a483ffab7d438"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product-to-category" DROP CONSTRAINT "FK_74e842980a178046c4c031a24f0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product" DROP CONSTRAINT "FK_1e5bc2ac4f3d1a8abd0fe9f9c84"`,
    );
    await queryRunner.query(`DROP TABLE "search"`);
    await queryRunner.query(`DROP TABLE "category"`);
    await queryRunner.query(`DROP TABLE "product-to-category"`);
    await queryRunner.query(`DROP TABLE "product"`);
    await queryRunner.query(`DROP TABLE "theme"`);
  }
}
