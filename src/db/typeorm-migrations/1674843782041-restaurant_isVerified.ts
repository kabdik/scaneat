import type { MigrationInterface, QueryRunner } from "typeorm";

export class restaurantIsVerified1674843782041 implements MigrationInterface {
    name = 'restaurantIsVerified1674843782041'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "photo" ("id" integer GENERATED ALWAYS AS IDENTITY NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "originalUrl" character varying NOT NULL, "thumbnails" jsonb NOT NULL, CONSTRAINT "PK_723fa50bf70dcfd06fb5a44d4ff" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "restaurant" ADD "isVerified" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "restaurant" ALTER COLUMN "phone" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "restaurant" ADD CONSTRAINT "UQ_859bd1106b8216d8b30cbbe1a15" UNIQUE ("phone")`);
        await queryRunner.query(`ALTER TABLE "restaurant" ALTER COLUMN "address" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "restaurant" ALTER COLUMN "rating" TYPE numeric`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "restaurant" ALTER COLUMN "rating" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "restaurant" ALTER COLUMN "address" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "restaurant" DROP CONSTRAINT "UQ_859bd1106b8216d8b30cbbe1a15"`);
        await queryRunner.query(`ALTER TABLE "restaurant" ALTER COLUMN "phone" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "restaurant" DROP COLUMN "isVerified"`);
        await queryRunner.query(`DROP TABLE "photo"`);
    }

}
