import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator"

export class createRestaurantBodyDto{
    @IsNotEmpty()
    @IsString()
    name!: string

    @IsNotEmpty()
    @IsString()
    slug!: string
    
    @IsOptional()
    @IsString()
    phone!: string | null

    @IsNotEmpty()
    @IsNumber()
    cityId!: number

    @IsString()
    address!: string | null

    @IsOptional()
    @IsBoolean()
    hasTakeAway!: boolean | null 

    @IsOptional()
    @IsBoolean()
    hasDelivery!: boolean | null 
}