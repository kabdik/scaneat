import type { MigrationInterface, QueryRunner } from "typeorm";

export class codeOrderEntity1677403290270 implements MigrationInterface {
    name = 'codeOrderEntity1677403290270'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_address" DROP CONSTRAINT "FK_d82a2840b5e5c98c569d75e92e8"`);
        await queryRunner.query(`ALTER TABLE "order" ADD "code" character varying`);
        await queryRunner.query(`ALTER TABLE "order_address" ADD CONSTRAINT "FK_d82a2840b5e5c98c569d75e92e8" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_address" DROP CONSTRAINT "FK_d82a2840b5e5c98c569d75e92e8"`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "code"`);
        await queryRunner.query(`ALTER TABLE "order_address" ADD CONSTRAINT "FK_d82a2840b5e5c98c569d75e92e8" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
