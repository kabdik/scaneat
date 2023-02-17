import type { MigrationInterface, QueryRunner } from "typeorm";

export class tgChatEntity1676662324209 implements MigrationInterface {
    name = 'tgChatEntity1676662324209'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "tg_chat" ("tgChatId" integer NOT NULL, CONSTRAINT "PK_5367eab0de22c019fbb7b7a16c8" PRIMARY KEY ("tgChatId"))`);
        await queryRunner.query(`CREATE TABLE "order_track" ("id" integer GENERATED ALWAYS AS IDENTITY NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "tgChatId" integer NOT NULL, "orderId" integer NOT NULL, CONSTRAINT "PK_15d058718c9b8fb8b9515388898" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "order_track" ADD CONSTRAINT "FK_6b549e8c47d8f1383fe0908e31a" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "order_track" ADD CONSTRAINT "FK_a08406fdb836554460914ace352" FOREIGN KEY ("tgChatId") REFERENCES "tg_chat"("tgChatId") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_track" DROP CONSTRAINT "FK_a08406fdb836554460914ace352"`);
        await queryRunner.query(`ALTER TABLE "order_track" DROP CONSTRAINT "FK_6b549e8c47d8f1383fe0908e31a"`);
        await queryRunner.query(`DROP TABLE "order_track"`);
        await queryRunner.query(`DROP TABLE "tg_chat"`);
    }

}
