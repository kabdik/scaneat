import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator"

export class CreateRestaurantBodyDto{
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
    @IsOptional()
    address!: string | null

    @IsOptional()
    @IsBoolean()
    hasTakeAway?: boolean 

    @IsOptional()
    @IsBoolean()
    hasDelivery?: boolean  
}