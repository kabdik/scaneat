import type { MigrationInterface, QueryRunner } from "typeorm";

export class removePhoneUnique1676037059564 implements MigrationInterface {
    name = 'removePhoneUnique1676037059564'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "restaurant" DROP CONSTRAINT "UQ_859bd1106b8216d8b30cbbe1a15"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "restaurant" ADD CONSTRAINT "UQ_859bd1106b8216d8b30cbbe1a15" UNIQUE ("phone")`);
    }

}
