import type { MigrationInterface, QueryRunner } from "typeorm";

export class init1674379403876 implements MigrationInterface {
    name = 'init1674379403876'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "city" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "slug" character varying NOT NULL, CONSTRAINT "UQ_f8c0858628830a35f19efdc0ecf" UNIQUE ("name"), CONSTRAINT "UQ_12c33d73f8702451fe40e4387ef" UNIQUE ("slug"), CONSTRAINT "PK_b222f51ce26f7e5ca86944a6739" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "restaurant" ("id" integer GENERATED ALWAYS AS IDENTITY NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying NOT NULL, "slug" character varying NOT NULL, "phone" text NOT NULL, "cityId" integer NOT NULL, "address" text NOT NULL, "rating" numeric NOT NULL DEFAULT '0', "hasTakeAway" boolean NOT NULL DEFAULT true, "hasDelivery" boolean NOT NULL DEFAULT false, "isActive" boolean NOT NULL DEFAULT true, CONSTRAINT "UQ_cb7f1c337dcb0595ba6d44265f6" UNIQUE ("slug"), CONSTRAINT "PK_649e250d8b8165cb406d99aa30f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."user_role_enum" AS ENUM('admin', 'systemManager', 'restaurantOwner', 'user', 'restaurantStaff')`);
        await queryRunner.query(`CREATE TABLE "user" ("id" integer GENERATED ALWAYS AS IDENTITY NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying NOT NULL, "surname" character varying NOT NULL, "email" character varying NOT NULL, "phone" text NOT NULL, "password" character varying NOT NULL, "role" "public"."user_role_enum" DEFAULT 'user', CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "UQ_8e1f623798118e629b46a9e6299" UNIQUE ("phone"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "restaurant" ADD CONSTRAINT "FK_2dee218ec5352ede6b4d56dcc79" FOREIGN KEY ("cityId") REFERENCES "city"("id") ON DELETE SET NULL ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "restaurant" DROP CONSTRAINT "FK_2dee218ec5352ede6b4d56dcc79"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
        await queryRunner.query(`DROP TABLE "restaurant"`);
        await queryRunner.query(`DROP TABLE "city"`);
    }

}
