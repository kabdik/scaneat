import type { MigrationInterface, QueryRunner } from "typeorm";

export class staffRoleFix1676294622007 implements MigrationInterface {
    name = 'staffRoleFix1676294622007'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "restaurant_staff" DROP CONSTRAINT "FK_0beeb075286d7c348c526b4a087"`);
        await queryRunner.query(`ALTER TABLE "staff_role" DROP CONSTRAINT "FK_d077662cd309b2a43ce6482987c"`);
        await queryRunner.query(`ALTER TABLE "staff_role" RENAME COLUMN "userId" TO "restaurantStaffId"`);
        await queryRunner.query(`ALTER TABLE "restaurant_staff" ADD CONSTRAINT "FK_0beeb075286d7c348c526b4a087" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "staff_role" ADD CONSTRAINT "FK_91f810c005cc17559b121df922d" FOREIGN KEY ("restaurantStaffId") REFERENCES "restaurant_staff"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "staff_role" DROP CONSTRAINT "FK_91f810c005cc17559b121df922d"`);
        await queryRunner.query(`ALTER TABLE "restaurant_staff" DROP CONSTRAINT "FK_0beeb075286d7c348c526b4a087"`);
        await queryRunner.query(`ALTER TABLE "staff_role" RENAME COLUMN "restaurantStaffId" TO "userId"`);
        await queryRunner.query(`ALTER TABLE "staff_role" ADD CONSTRAINT "FK_d077662cd309b2a43ce6482987c" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "restaurant_staff" ADD CONSTRAINT "FK_0beeb075286d7c348c526b4a087" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
