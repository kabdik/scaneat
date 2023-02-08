import type { MigrationInterface, QueryRunner } from "typeorm";

export class redoRestaurantOwnerEntity1675866046724 implements MigrationInterface {
    name = 'redoRestaurantOwnerEntity1675866046724'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "restaurant_owner" DROP CONSTRAINT "FK_916d67949403070d08b4d04efa1"`);
        await queryRunner.query(`ALTER TABLE "restaurant_owner" DROP COLUMN "restaurantId"`);
        await queryRunner.query(`ALTER TABLE "restaurant" ADD "restaurantOwnerId" integer`);
        await queryRunner.query(`ALTER TABLE "restaurant" ADD CONSTRAINT "FK_b7c85f1eef3e6a37681ddb64b3f" FOREIGN KEY ("restaurantOwnerId") REFERENCES "restaurant_owner"("id") ON DELETE SET NULL ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "restaurant" DROP CONSTRAINT "FK_b7c85f1eef3e6a37681ddb64b3f"`);
        await queryRunner.query(`ALTER TABLE "restaurant" DROP COLUMN "restaurantOwnerId"`);
        await queryRunner.query(`ALTER TABLE "restaurant_owner" ADD "restaurantId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "restaurant_owner" ADD CONSTRAINT "FK_916d67949403070d08b4d04efa1" FOREIGN KEY ("restaurantId") REFERENCES "restaurant"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

}
