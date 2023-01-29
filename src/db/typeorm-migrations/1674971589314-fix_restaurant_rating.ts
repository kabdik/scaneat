import type { MigrationInterface, QueryRunner } from "typeorm";

export class fixRestaurantRating1674971589314 implements MigrationInterface {
    name = 'fixRestaurantRating1674971589314'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "restaurant" ALTER COLUMN "rating" TYPE numeric(3,2)`);
        await queryRunner.query(`ALTER TABLE "restaurant" ADD CONSTRAINT "CHK_2b7dfc779f679ede94031f7b27" CHECK ("rating" >= 0.00 AND "rating" <= 5.00)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "restaurant" DROP CONSTRAINT "CHK_2b7dfc779f679ede94031f7b27"`);
        await queryRunner.query(`ALTER TABLE "restaurant" ALTER COLUMN "rating" TYPE numeric`);
    }

}
