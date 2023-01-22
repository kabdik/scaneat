import { CityEntity } from "@/modules/cities/city.entity"
import type { City } from "@/modules/cities/city.interface"
import { In, MigrationInterface, QueryRunner } from "typeorm"

const cities:City[]= require('../fixtures/city.json')

export class citySeed1674379500417 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.manager.insert(CityEntity, cities)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.manager.delete(CityEntity, { id: In(cities.map((city) => city.id)) })
    }

}
