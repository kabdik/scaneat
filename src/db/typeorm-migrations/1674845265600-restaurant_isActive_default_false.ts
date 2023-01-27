import type { MigrationInterface, QueryRunner } from "typeorm";

export class restaurantIsActiveDefaultFalse1674845265600 implements MigrationInterface {
    name = 'restaurantIsActiveDefaultFalse1674845265600'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "restaurant" ALTER COLUMN "rating" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "restaurant" ALTER COLUMN "isActive" SET DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "restaurant" ALTER COLUMN "isActive" SET DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "restaurant" ALTER COLUMN "rating" TYPE numeric`);
    }

}
