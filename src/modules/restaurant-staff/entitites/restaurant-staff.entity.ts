import { BaseEntity } from "@/common/entities/base.entity";
import { TableName } from "@/common/enums/table";
import { RestaurantEntity } from "@/modules/restaurant/entities/restaurant.entity";
import { UserEntity } from "@/modules/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { RestaurnatStaffRole } from "../enums/restaurant-staff-role.enum";
import type { RestaurantStaff } from "../interfaces/restaurant-staff.interface";

@Entity(TableName.RESTAURANT_STAFF)
export class RestaurantStaffEntity extends BaseEntity implements RestaurantStaff{
    @Column('int')
    userId!: number;

    @Column('int')
    restaurantId!: number

    @Column('enum', {enum:RestaurnatStaffRole, nullable:false})
    role!: RestaurnatStaffRole;

    @ManyToOne(() => UserEntity)
    @JoinColumn({ name: 'userId'})
    user?: UserEntity;

    @ManyToOne(() => RestaurantEntity)
    @JoinColumn({ name: 'restaurantId'})
    restaurant?: RestaurantEntity; 
}