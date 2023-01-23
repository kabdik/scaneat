import type { MigrationInterface, QueryRunner } from "typeorm";

export class restaurantUsers1674475499289 implements MigrationInterface {
    name = 'restaurantUsers1674475499289'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "restaurant_owner" ("id" integer GENERATED ALWAYS AS IDENTITY NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "userId" integer NOT NULL, "restaurantId" integer NOT NULL, CONSTRAINT "PK_fe7a22ecf454b7168b5a37fbdce" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."restaurant_staff_role_enum" AS ENUM('manager', 'chef')`);
        await queryRunner.query(`CREATE TABLE "restaurant_staff" ("id" integer GENERATED ALWAYS AS IDENTITY NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "userId" integer NOT NULL, "restaurantId" integer NOT NULL, "role" "public"."restaurant_staff_role_enum" NOT NULL, CONSTRAINT "PK_6b47b2ff71d81e5d3c18117b228" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "restaurant" ALTER COLUMN "rating" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "restaurant_owner" ADD CONSTRAINT "FK_bd78930d9604ecbfeb198ed3b79" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "restaurant_owner" ADD CONSTRAINT "FK_916d67949403070d08b4d04efa1" FOREIGN KEY ("restaurantId") REFERENCES "restaurant"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "restaurant_staff" ADD CONSTRAINT "FK_0beeb075286d7c348c526b4a087" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "restaurant_staff" ADD CONSTRAINT "FK_7b92adc5a1bd224af527dc63963" FOREIGN KEY ("restaurantId") REFERENCES "restaurant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "restaurant_staff" DROP CONSTRAINT "FK_7b92adc5a1bd224af527dc63963"`);
        await queryRunner.query(`ALTER TABLE "restaurant_staff" DROP CONSTRAINT "FK_0beeb075286d7c348c526b4a087"`);
        await queryRunner.query(`ALTER TABLE "restaurant_owner" DROP CONSTRAINT "FK_916d67949403070d08b4d04efa1"`);
        await queryRunner.query(`ALTER TABLE "restaurant_owner" DROP CONSTRAINT "FK_bd78930d9604ecbfeb198ed3b79"`);
        await queryRunner.query(`ALTER TABLE "restaurant" ALTER COLUMN "rating" TYPE numeric`);
        await queryRunner.query(`DROP TABLE "restaurant_staff"`);
        await queryRunner.query(`DROP TYPE "public"."restaurant_staff_role_enum"`);
        await queryRunner.query(`DROP TABLE "restaurant_owner"`);
    }

}
