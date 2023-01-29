import type { MigrationInterface, QueryRunner } from "typeorm";

export class categoryNameRestaurantIdUnique1674992392022 implements MigrationInterface {
    name = 'categoryNameRestaurantIdUnique1674992392022'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_f2c222efef1bfbfd158f881db9" ON "category" ("name", "restaurantId") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_f2c222efef1bfbfd158f881db9"`);
    }

}
