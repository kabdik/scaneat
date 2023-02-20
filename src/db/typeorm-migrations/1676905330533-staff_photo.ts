import type { MigrationInterface, QueryRunner } from "typeorm";

export class staffPhoto1676905330533 implements MigrationInterface {
    name = 'staffPhoto1676905330533'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "restaurant_staff" ADD "photoId" integer`);
        await queryRunner.query(`ALTER TABLE "restaurant_staff" ADD CONSTRAINT "UQ_e85be833e201b19fc05b14f6f2a" UNIQUE ("photoId")`);
        await queryRunner.query(`ALTER TABLE "restaurant_staff" ADD CONSTRAINT "FK_e85be833e201b19fc05b14f6f2a" FOREIGN KEY ("photoId") REFERENCES "photo"("id") ON DELETE SET NULL ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "restaurant_staff" DROP CONSTRAINT "FK_e85be833e201b19fc05b14f6f2a"`);
        await queryRunner.query(`ALTER TABLE "restaurant_staff" DROP CONSTRAINT "UQ_e85be833e201b19fc05b14f6f2a"`);
        await queryRunner.query(`ALTER TABLE "restaurant_staff" DROP COLUMN "photoId"`);
    }

}
