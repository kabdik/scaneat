import type { MigrationInterface, QueryRunner } from "typeorm";

export class restaurantPhotoRelation1675155857511 implements MigrationInterface {
    name = 'restaurantPhotoRelation1675155857511'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "restaurant" ADD "photoId" integer`);
        await queryRunner.query(`ALTER TABLE "restaurant" ADD CONSTRAINT "FK_fa35bc02d8304ed73acc6821d93" FOREIGN KEY ("photoId") REFERENCES "photo"("id") ON DELETE SET NULL ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "restaurant" DROP CONSTRAINT "FK_fa35bc02d8304ed73acc6821d93"`);
        await queryRunner.query(`ALTER TABLE "restaurant" DROP COLUMN "photoId"`);
    }

}
