import type { MigrationInterface, QueryRunner } from "typeorm";

export class categorySpelling1674385028224 implements MigrationInterface {
    name = 'categorySpelling1674385028224'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "category" RENAME COLUMN "desctiption" TO "description"`);
        await queryRunner.query(`ALTER TABLE "restaurant" ALTER COLUMN "rating" TYPE numeric`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "restaurant" ALTER COLUMN "rating" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "category" RENAME COLUMN "description" TO "desctiption"`);
    }

}
