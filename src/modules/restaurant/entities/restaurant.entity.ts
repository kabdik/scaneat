import { BaseEntity } from "@/common/entities/base.entity";
import { TableName } from "@/common/enums/table";
import { CityEntity } from "@/modules/cities/city.entity";
import { RestaurantOwnerEntity } from "@/modules/restaurant-owner/entities/restaurant-owner.entity";
import type { RestaurantOwner } from "@/modules/restaurant-owner/interfaces/restaurant-owner.intereface";
import { Check, Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { VerificationStatus } from "../enum/verification-status.enum";
import type {  Restaurant } from "../interfaces/restaurant.interface";

@Entity(TableName.RESTAURANT)
export class RestaurantEntity extends BaseEntity implements Restaurant {
    @Column('varchar')
    name!:string

    @Column('varchar', { unique: true })
    slug!: string;
    
    @Column('text', { unique: true, nullable: true })
    phone!:string | null

    @Column('int')
    cityId!:number

    @Column('text', {nullable: true})
    address!: string | null

    @Column('numeric', { default:0.00, scale:2, precision:3})
    @Check(`"rating" >= 0.00 AND "rating" <= 5.00`)
    rating!:number

    @Column('boolean', { default:true})
    hasTakeAway!: boolean

    @Column('boolean', { default:false})
    hasDelivery!: boolean
    
    @Column('boolean', { default:false})
    isActive!: boolean

    @Column('enum', { enum: VerificationStatus, default: VerificationStatus.PENDING})
    verificationStatus!: VerificationStatus

    @ManyToOne(()=>CityEntity,{
        onDelete:"SET NULL",
        onUpdate:"CASCADE"
})
    @JoinColumn({name:'cityId'})
    city?:CityEntity

    @OneToMany(()=>RestaurantOwnerEntity, (restaurantOwner)=> restaurantOwner.restaurant)
    restaurantOwner!:RestaurantOwner
}