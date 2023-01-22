import type { MigrationInterface, QueryRunner } from "typeorm";

export class moreEntities1674383960181 implements MigrationInterface {
    name = 'moreEntities1674383960181'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "category" ("id" integer GENERATED ALWAYS AS IDENTITY NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying NOT NULL, "restaurantId" integer NOT NULL, "desctiption" text NOT NULL, "isActive" boolean NOT NULL, CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "product" ("id" integer GENERATED ALWAYS AS IDENTITY NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "description" text NOT NULL, "price" numeric(10,2) NOT NULL, "restaurantId" integer NOT NULL, "categoryId" integer NOT NULL, CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "restaurant" ALTER COLUMN "rating" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "category" ADD CONSTRAINT "FK_e11b13ec63270b4a842a9f3abc0" FOREIGN KEY ("restaurantId") REFERENCES "restaurant"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "product" ADD CONSTRAINT "FK_3249a5709fb37437198f7dff801" FOREIGN KEY ("restaurantId") REFERENCES "restaurant"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "product" ADD CONSTRAINT "FK_ff0c0301a95e517153df97f6812" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE SET NULL ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "FK_ff0c0301a95e517153df97f6812"`);
        await queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "FK_3249a5709fb37437198f7dff801"`);
        await queryRunner.query(`ALTER TABLE "category" DROP CONSTRAINT "FK_e11b13ec63270b4a842a9f3abc0"`);
        await queryRunner.query(`ALTER TABLE "restaurant" ALTER COLUMN "rating" TYPE numeric`);
        await queryRunner.query(`DROP TABLE "product"`);
        await queryRunner.query(`DROP TABLE "category"`);
    }

}
