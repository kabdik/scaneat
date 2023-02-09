import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateRestaurantOwnerRequestBodyDto{
    @IsString()
    @IsNotEmpty()
    name!:string;
    
    @IsString()
    @IsNotEmpty()
    surname!: string;  

    @IsString()
    @IsNotEmpty()
    email!:string;

    @IsString()
    @IsOptional()
    phone?:string;
    
}
