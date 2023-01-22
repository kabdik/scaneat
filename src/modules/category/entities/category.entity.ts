import { BaseEntity } from "@/common/entities/base.entity";
import { TableName } from "@/common/enums/table";
import { ProductEntity } from "@/modules/product/entitites/product.entity";
import { RestaurantEntity } from "@/modules/restaurant/entities/restaurant.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import type { Category } from "../interfaces/category.interface";

@Entity(TableName.CATEGORY)
export class CategoryEntity extends BaseEntity implements Category{
    @Column('varchar')
    name!:string

    @Column('int')
    restaurantId!: number;

    @Column('text')
    description!: string;

    @Column('boolean')
    isActive!: boolean;

    @ManyToOne(() => RestaurantEntity,{
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    })
    @JoinColumn({ name: 'restaurantId' })
    restaurant?: RestaurantEntity

    @OneToMany(() => ProductEntity, product => product.category)
    products?: ProductEntity[]
}