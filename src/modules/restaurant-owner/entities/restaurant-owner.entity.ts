import { BaseEntity } from "@/common/entities/base.entity";
import { TableName } from "@/common/enums/table";
import { UserEntity } from "@/modules/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import type { RestaurantOwner } from "../interfaces/restaurant-owner.intereface";

@Entity(TableName.RESTAURANT_OWNER)
export class RestaurantOwnerEntity extends BaseEntity implements RestaurantOwner{
    @Column('int')
    userId!:number

    @ManyToOne(() => UserEntity, {
        onDelete: 'CASCADE', 
        onUpdate: 'CASCADE'
    })
    @JoinColumn({ name: 'userId' })
    user?: UserEntity
}