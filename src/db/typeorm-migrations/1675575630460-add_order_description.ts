import type { MigrationInterface, QueryRunner } from "typeorm";

export class addOrderDescription1675575630460 implements MigrationInterface {
    name = 'addOrderDescription1675575630460'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" ADD "description" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "description"`);
    }

}
