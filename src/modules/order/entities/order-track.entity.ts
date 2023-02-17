import { BaseEntity } from "@/common/entities/base.entity";
import { TableName } from "@/common/enums/table";
import { TgChatEntity } from "@/modules/telegram/entities/tg-chat.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import type { OrderTrack } from "../interfaces/order-track.interface";
import { OrderEntity } from "./order.entity";

@Entity(TableName.ORDER_TRACK)
export class OrderTrackEntity extends BaseEntity implements OrderTrack{
    @Column('int')
    tgChatId!:number

    @Column('int')
    orderId!:number

    @ManyToOne(()=>OrderEntity,{
        onDelete:'CASCADE',
        onUpdate:'CASCADE'
    })
    @JoinColumn({name:'orderId'})
    order?:OrderEntity

    @ManyToOne(()=>TgChatEntity,{
        onDelete:'CASCADE',
        onUpdate:'CASCADE'
    })
    @JoinColumn({name:'tgChatId'})
    tgChat?:TgChatEntity
}