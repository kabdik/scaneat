import type { MigrationInterface, QueryRunner } from "typeorm";

export class productUnitPrice1675590949215 implements MigrationInterface {
    name = 'productUnitPrice1675590949215'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" ADD "unitPrice" numeric(10,2) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "unitPrice"`);
    }

}
