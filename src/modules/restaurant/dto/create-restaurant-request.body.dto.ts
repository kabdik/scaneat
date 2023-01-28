import { CreateRestaurantOwnerRequestBodyDto } from "@/modules/restaurant-owner/dto/create-restaurant-owner.body.dto";
import { Type } from "class-transformer";
import { IsNotEmpty, ValidateNested } from "class-validator";
import { CreateRestaurantBodyDto } from "./create-restaurant.body.dto";


export class CreateRestaurantRequestBodyDto{
    @IsNotEmpty()
    @Type(() => CreateRestaurantBodyDto)
    @ValidateNested()
    restaurant!:CreateRestaurantBodyDto;

    @IsNotEmpty()
    @Type(() => CreateRestaurantOwnerRequestBodyDto)
    @ValidateNested()
    restaurantOwner!:CreateRestaurantOwnerRequestBodyDto

}