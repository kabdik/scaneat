import { BaseEntity } from "@/common/entities/base.entity";
import { TableName } from "@/common/enums/table";
import { CityEntity } from "@/modules/cities/city.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import type { OrderAddress } from "../interfaces/order-address.interface";
import { OrderEntity } from "./order.entity";

@Entity(TableName.ORDER_ADDRESS)
export class OrderAddressEntity extends BaseEntity implements OrderAddress{
    @Column('int')
    cityId!: number;
    
    @Column('int')
    orderId!: number;

    @Column('varchar')
    address!: string;

    @Column('varchar')
    details!: string;

    @ManyToOne(() => CityEntity)
    @JoinColumn({name:'cityId'})
    city?:CityEntity

    @ManyToOne(() => OrderEntity)
    @JoinColumn({name:'orderId'})
    order?:OrderEntity
}