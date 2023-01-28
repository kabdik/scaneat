import type { MigrationInterface, QueryRunner } from "typeorm";

export class restaurantVerificationStatus1674882262670 implements MigrationInterface {
    name = 'restaurantVerificationStatus1674882262670'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "restaurant" RENAME COLUMN "isVerified" TO "verificationStatus"`);
        await queryRunner.query(`ALTER TABLE "restaurant" ALTER COLUMN "rating" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "restaurant" DROP COLUMN "verificationStatus"`);
        await queryRunner.query(`CREATE TYPE "public"."restaurant_verificationstatus_enum" AS ENUM('pending', 'accepted', 'rejected')`);
        await queryRunner.query(`ALTER TABLE "restaurant" ADD "verificationStatus" "public"."restaurant_verificationstatus_enum" NOT NULL DEFAULT 'pending'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "restaurant" DROP COLUMN "verificationStatus"`);
        await queryRunner.query(`DROP TYPE "public"."restaurant_verificationstatus_enum"`);
        await queryRunner.query(`ALTER TABLE "restaurant" ADD "verificationStatus" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "restaurant" ALTER COLUMN "rating" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "restaurant" RENAME COLUMN "verificationStatus" TO "isVerified"`);
    }

}
