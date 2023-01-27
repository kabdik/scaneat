import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import type {RestaurnatStaffRole } from "../enums/restaurant-staff-role.enum"
export class CreateStaffBodyDto{
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

    @IsString()
    @IsNotEmpty()
    role!:RestaurnatStaffRole;
}