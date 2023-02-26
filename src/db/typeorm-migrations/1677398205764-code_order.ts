import type { MigrationInterface, QueryRunner } from "typeorm";

export class codeOrder1677398205764 implements MigrationInterface {
    name = 'codeOrder1677398205764'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" ADD "code" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "code"`);
    }

}
