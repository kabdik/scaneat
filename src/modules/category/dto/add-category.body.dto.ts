import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class AddCategoryBodyDto{
    @IsString()
    @IsNotEmpty()
    name!: string

    @IsString()
    @IsNotEmpty()
    description!: string

    @IsOptional()
    @IsBoolean()
    isActive?: boolean
} 

export class AddCategoryWithRestaurantDto extends AddCategoryBodyDto{
    @IsNumber()
    @IsNotEmpty()
    restaurantId!: number
}