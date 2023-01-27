import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateRestaurantOwnerBodyDto{
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
    phone!:string | null;
    
}