import { BaseEntity } from "@/common/entities/base.entity";
import { TableName } from "@/common/enums/table";
import { CityEntity } from "@/modules/cities/city.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import type {  Restaurant } from "../interfaces/restaurant.interface";

@Entity(TableName.RESTAURANT)
export class RestaurantEntity extends BaseEntity implements Restaurant {
    @Column('varchar')
    name!:string

    @Column('varchar', { unique: true })
    slug!: string;
    
    @Column('text')
    phone!:string

    @Column('int')
    cityId!:number

    @Column('text')
    address!:string

    @Column('numeric',{scale:1,default:0.0,nullable:false})
    rating!:number

    @Column('boolean',{default:true})
    hasTakeAway!: boolean

    @Column('boolean',{default:false})
    hasDelivery!: boolean
    
    @Column('boolean',{default:true})
    isActive!: boolean

    @ManyToOne(()=>CityEntity,{
        onDelete:"SET NULL",
        onUpdate:"CASCADE"
})
    @JoinColumn({name:'cityId'})
    city?:CityEntity
}