import type { MigrationInterface, QueryRunner } from "typeorm";

export class onDeleteOnUpdateOrderUser1676037850214 implements MigrationInterface {
    name = 'onDeleteOnUpdateOrderUser1676037850214'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_caabe91507b3379c7ba73637b84"`);
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_c93f22720c77241d2476c07cabf"`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_caabe91507b3379c7ba73637b84" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_c93f22720c77241d2476c07cabf" FOREIGN KEY ("restaurantId") REFERENCES "restaurant"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_c93f22720c77241d2476c07cabf"`);
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_caabe91507b3379c7ba73637b84"`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_c93f22720c77241d2476c07cabf" FOREIGN KEY ("restaurantId") REFERENCES "restaurant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_caabe91507b3379c7ba73637b84" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
