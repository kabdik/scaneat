import { BaseEntity } from "@/common/entities/base.entity";
import { TableName } from "@/common/enums/table";
import { RestaurantEntity } from "@/modules/restaurant/entities/restaurant.entity";
import { UserEntity } from "@/modules/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import type { RestaurantOwner } from "../interfaces/restaurant-owner.intereface";

@Entity(TableName.RESTAURANT_OWNER)
export class RestaurantOwnerEntity extends BaseEntity implements RestaurantOwner{
    @Column('int')
    userId!:number

    @Column('int')
    restaurantId!: number;

    @ManyToOne(() => UserEntity, {
        onDelete: 'CASCADE', 
        onUpdate: 'CASCADE'
    })
    @JoinColumn({ name: 'userId' })
    user?: UserEntity

    @ManyToOne(() => RestaurantEntity, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    })
    @JoinColumn({ name: 'restaurantId' })
    restaurant?: RestaurantEntity

}