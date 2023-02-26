import type { MigrationInterface, QueryRunner } from "typeorm";

export class codeNullable1677402129332 implements MigrationInterface {
    name = 'codeNullable1677402129332'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" ALTER COLUMN "code" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" ALTER COLUMN "code" SET NOT NULL`);
    }

}
