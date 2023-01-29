import type { MigrationInterface, QueryRunner } from "typeorm";

export class categotyIsActiveTrue1674991348263 implements MigrationInterface {
    name = 'categotyIsActiveTrue1674991348263'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "category" ALTER COLUMN "isActive" SET DEFAULT true`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "category" ALTER COLUMN "isActive" DROP DEFAULT`);
    }

}
