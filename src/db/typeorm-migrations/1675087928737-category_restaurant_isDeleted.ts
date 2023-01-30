import type { MigrationInterface, QueryRunner } from "typeorm";

export class categoryRestaurantIsDeleted1675087928737 implements MigrationInterface {
    name = 'categoryRestaurantIsDeleted1675087928737'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" ADD "isDeleted" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "category" ADD "isDeleted" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "category" DROP COLUMN "isDeleted"`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "isDeleted"`);
    }

}
