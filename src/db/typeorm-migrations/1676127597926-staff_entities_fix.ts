import type { MigrationInterface, QueryRunner } from "typeorm";

export class staffEntitiesFix1676127597926 implements MigrationInterface {
    name = 'staffEntitiesFix1676127597926'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "restaurant_staff" DROP CONSTRAINT "FK_7b92adc5a1bd224af527dc63963"`);
        await queryRunner.query(`CREATE TYPE "public"."staff_role_role_enum" AS ENUM('admin', 'systemManager', 'restaurantOwner', 'user', 'restaurantStaff', 'manager', 'chef')`);
        await queryRunner.query(`CREATE TABLE "staff_role" ("id" integer GENERATED ALWAYS AS IDENTITY NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "userId" integer NOT NULL, "role" "public"."staff_role_role_enum", "restaurantId" integer NOT NULL, CONSTRAINT "PK_c3fe01125c99573751fe5e55666" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "restaurant_staff" DROP COLUMN "restaurantId"`);
        await queryRunner.query(`ALTER TABLE "restaurant_staff" DROP COLUMN "role"`);
        await queryRunner.query(`DROP TYPE "public"."restaurant_staff_role_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."user_role_enum" RENAME TO "user_role_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."user_role_enum" AS ENUM('admin', 'systemManager', 'restaurantOwner', 'user', 'restaurantStaff', 'manager', 'chef')`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "role" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "role" TYPE "public"."user_role_enum" USING "role"::"text"::"public"."user_role_enum"`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "role" SET DEFAULT 'user'`);
        await queryRunner.query(`DROP TYPE "public"."user_role_enum_old"`);
        await queryRunner.query(`ALTER TABLE "staff_role" ADD CONSTRAINT "FK_d077662cd309b2a43ce6482987c" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "staff_role" ADD CONSTRAINT "FK_dba4dc470c3f172b5881a74d195" FOREIGN KEY ("restaurantId") REFERENCES "restaurant"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "staff_role" DROP CONSTRAINT "FK_dba4dc470c3f172b5881a74d195"`);
        await queryRunner.query(`ALTER TABLE "staff_role" DROP CONSTRAINT "FK_d077662cd309b2a43ce6482987c"`);
        await queryRunner.query(`CREATE TYPE "public"."user_role_enum_old" AS ENUM('admin', 'systemManager', 'restaurantOwner', 'user', 'restaurantStaff')`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "role" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "role" TYPE "public"."user_role_enum_old" USING "role"::"text"::"public"."user_role_enum_old"`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "role" SET DEFAULT 'user'`);
        await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."user_role_enum_old" RENAME TO "user_role_enum"`);
        await queryRunner.query(`CREATE TYPE "public"."restaurant_staff_role_enum" AS ENUM('manager', 'chef')`);
        await queryRunner.query(`ALTER TABLE "restaurant_staff" ADD "role" "public"."restaurant_staff_role_enum" NOT NULL`);
        await queryRunner.query(`ALTER TABLE "restaurant_staff" ADD "restaurantId" integer NOT NULL`);
        await queryRunner.query(`DROP TABLE "staff_role"`);
        await queryRunner.query(`DROP TYPE "public"."staff_role_role_enum"`);
        await queryRunner.query(`ALTER TABLE "restaurant_staff" ADD CONSTRAINT "FK_7b92adc5a1bd224af527dc63963" FOREIGN KEY ("restaurantId") REFERENCES "restaurant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
