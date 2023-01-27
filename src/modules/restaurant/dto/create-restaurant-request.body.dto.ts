import { CreateRestaurantOwnerBodyDto } from "@/modules/restaurant-owner/dto/create-restaurant-owner.body.dto";
import { Type } from "class-transformer";
import { IsNotEmpty, ValidateNested } from "class-validator";
import { createRestaurantBodyDto } from "./create-restaurant.body.dto";


export class createRestaurantRequestBodyDto{
    @IsNotEmpty()
    @Type(() => createRestaurantBodyDto)
    @ValidateNested()
    restaurant!:createRestaurantBodyDto;

    @IsNotEmpty()
    @Type(() => CreateRestaurantOwnerBodyDto)
    @ValidateNested()
    restaurantOwner!:CreateRestaurantOwnerBodyDto

}