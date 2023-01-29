import type { MigrationInterface, QueryRunner } from "typeorm";

export class productNameRestaurantIdUnique1674992232583 implements MigrationInterface {
    name = 'productNameRestaurantIdUnique1674992232583'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "UQ_22cc43e9a74d7498546e9a63e77"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_a2a2dca0910f792d8980240a8e" ON "product" ("name", "restaurantId") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_a2a2dca0910f792d8980240a8e"`);
        await queryRunner.query(`ALTER TABLE "product" ADD CONSTRAINT "UQ_22cc43e9a74d7498546e9a63e77" UNIQUE ("name")`);
    }

}
